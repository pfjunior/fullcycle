import { Sequelize } from "sequelize-typescript";
import Customer from "../../../domain/customer/entities/customer";
import Address from "../../../domain/customer/value-objects/address";
import CustomerModel from "../../../infrastructure/customer/repositories/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repositories/sequelize/customer.repository";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test Find Customer Use Case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

        const customer = new Customer("c1", "Customer 1");
        customer.changeAddress(new Address("Street 1", 1, "12345-678", "City 1"));

        await customerRepository.create(customer);

        const input = {
            id: "c1",
        };

        const output = {
            id: "c1",
            name: "Customer 1",
            address: {
                street: "Street 1",
                number: 1,
                zip: "12345-678",
                city: "City 1"
            },
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});