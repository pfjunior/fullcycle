import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProducAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import Address from "../../../shared/domain/value-object/address.value-object";
import Id from "../../../shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "./placer-order.usecase.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProducAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProducAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    // Validar produto - Função a parte
    await this.validateProducts(input);

    // Recuperar os produtos
    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    // Criar o objeto de client
    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.address.street,
        client.address.number,
        client.address.complement,
        client.address.city,
        client.address.state,
        client.address.zipCode
      ),
    });

    // Cirar o objeto de order(client, products)
    const order = new Order({ client: myClient, products });

    // Processa o pagamento
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    // Caso pagamento seja aprovado -> gerar invoice
    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address.street,
            complement: client.address.complement,
            number: client.address.number,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            items: products.map((p) => {
              return { id: p.id.id, name: p.name, price: p.salesPrice };
            }),
          })
        : null;

    // Mudar o status da order para approved
    payment.status === "approved" && order.approved();
    this._repository.addOrder(order);

    // Retornar dto
    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return { productId: p.id.id };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
