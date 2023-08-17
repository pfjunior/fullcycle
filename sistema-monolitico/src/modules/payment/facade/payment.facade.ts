import UseCaseInterface from "../../shared/usecase/use-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
    constructor(private useCase: UseCaseInterface) { }

    async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return await this.useCase.execute(input);
    }
}