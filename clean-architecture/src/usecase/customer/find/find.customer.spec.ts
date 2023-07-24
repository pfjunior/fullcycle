
import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repositories/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import Customer from "../../../domain/customer/entities/customer";
import Address from "../../../domain/customer/value-objects/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test Find Customer Use Case", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([CustomerModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "12345-678", "City 1"));
        await customerRepository.create(customer);

        const input = { id: "c1" };

        const output = {
            id: "c1",
            name: "Customer 1",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 1,
                zip: "12345-678"
            }
        };

        const result = useCase.execute(input);

        expect(result).toEqual(output);
    });
});