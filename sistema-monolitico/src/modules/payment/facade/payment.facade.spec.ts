import { Sequelize } from "sequelize-typescript";
import Transaction from "../domain/transaction.entity";
import Id from "../../shared/domain/value-object/id.value-object";
import { TransactionModel } from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";

describe("Client Repository Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a transaction", async () => {
        const repository = new TransactionRepository();
        const useCase = new ProcessPaymentUseCase(repository);
        const facade = new PaymentFacade(useCase);

        const input = {
            amount: 100,
            orderId: "o1"
        };

        const result = await facade.process(input);

        expect(result.transactionId).toBeDefined();
        expect(result.orderId).toBe(input.orderId);
        expect(result.amount).toBe(input.amount);
        expect(result.status).toBe("approved");
    });
});