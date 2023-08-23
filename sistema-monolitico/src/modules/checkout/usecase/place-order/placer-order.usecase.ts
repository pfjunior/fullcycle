import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import UseCaseInterface from "../../../shared/usecase/use-case.interface";
import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "./placer-order.usecase.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;

  constructor(clientFacade: ClientAdmFacadeInterface) {
    this._clientFacade = clientFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });

    if (!client) {
      throw new Error("Client not found");
    }

    // Validar produto - Função a parte

    // Recuperar os produtos

    // Criar o objeto de client

    // Cirar o objeto de order(client, products)

    // Caso pagamento seja aprovado -> gerar invoice

    // Mudar o status da order para approved

    // Retornar dto

    return;
  }
}
