import UseCaseInterface from "../../../shared/usecase/use-case.interface";
import PaymentGateway from "../../Gateway/payment.gateway";
import Transaction from "../../domain/transaction.entity";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.usecase.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
    constructor(private repository: PaymentGateway) { }

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId
        });
        transaction.process();

        const result = await this.repository.save(transaction);

        return {
            transactionId: result.id.id,
            orderId: result.orderId,
            amount: result.amount,
            status: transaction.status,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        };
    }
}