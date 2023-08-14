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

const transactionDeclined = new Transaction({
    id: new Id("t1"),
    amount: 50,
    orderId: "o1"
});

const MockRepositoryDeclined = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transactionDeclined))
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

    it("should decline a transaction", async () => {
        const repository = MockRepositoryDeclined();
        const useCase = new ProcessPaymentUseCase(repository);

        const result = await useCase.execute({
            orderId: transactionDeclined.orderId,
            amount: transactionDeclined.amount
        });

        expect(repository.save).toHaveBeenCalled();
        expect(result.transactionId).toBe(transactionDeclined.id.id);
        expect(result.status).toBe("declined");
        expect(result.amount).toBe(transactionDeclined.amount);
        expect(result.orderId).toBe(transactionDeclined.orderId);
        expect(result.createdAt).toBe(transactionDeclined.createdAt);
        expect(result.updatedAt).toBe(transactionDeclined.updatedAt);
    });
});