import Id from "../../../shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction.entity";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id("t1"),
    amount: 100,
    orderId: "o1"
});

const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction))
    };
};

describe("Process Payment UseCase Unit Test", () => {
    it("should approve a transaction", async () => {
        const repository = MockRepository();
        const useCase = new ProcessPaymentUseCase(repository);

        const result = await useCase.execute({
            orderId: transaction.orderId,
            amount: transaction.amount
        });

        expect(repository.save).toHaveBeenCalled();
        expect(result.transactionId).toBe(transaction.id.id);
        expect(result.status).toBe("approved");
        expect(result.amount).toBe(transaction.amount);
        expect(result.orderId).toBe(transaction.orderId);
        expect(result.createdAt).toBe(transaction.createdAt);
        expect(result.updatedAt).toBe(transaction.updatedAt);
    });
});