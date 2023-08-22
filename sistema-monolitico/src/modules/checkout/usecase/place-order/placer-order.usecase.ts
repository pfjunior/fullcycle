import UseCaseInterface from "../../../shared/usecase/use-case.interface";
import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
} from "./placer-order.usecase.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor() {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    return;
  }
}
