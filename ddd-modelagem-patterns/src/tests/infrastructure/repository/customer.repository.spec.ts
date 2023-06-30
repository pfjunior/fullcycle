import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import Customer from "../../../domain/entities/customer";
import Address from "../../../domain/entities/address";

describe("Product Repository Test", () => {
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

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "c1",
            name: customer.name,
            street: address.street,
            number: address.number,
            zipCode: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.changeName("Customer 02");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "c1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipCode: address.zip,
            city: address.city
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);
    });

    it("should throw an error when customer is not found", () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("c2");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("c1", "Customer 01");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        customer1.addRewardsPoints(10);
        customer1.activate();

        const customer2 = new Customer("c2", "Customer 02");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        customer2.addRewardsPoints(20);
        customer2.activate();

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    });
});