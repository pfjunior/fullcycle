import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProducAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import Id from "../../../shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Product from "../../domain/product.entity";
import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "./placer-order.usecase.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProducAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProducAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    // Validar produto - Função a parte
    await this.validateProducts(input);

    // Recuperar os produtos

    // Criar o objeto de client

    // Cirar o objeto de order(client, products)

    // Caso pagamento seja aprovado -> gerar invoice

    // Mudar o status da order para approved

    // Retornar dto

    return {
      id: "",
      invoiceId: "",
      status: "",
      total: 0,
      products: [],
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
