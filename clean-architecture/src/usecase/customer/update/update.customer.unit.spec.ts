import CustomerFactory from "../../../domain/customer/factories/customer.factory";
import Address from "../../../domain/customer/value-objects/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress("Customer 1", new Address("Street 1", 1, "12345-678", "City 1"));

const input = {
    id: customer.id,
    name: "Customer Updated",
    address: {
        street: "Street 1 Updated",
        number: 101,
        zip: "12345-876",
        city: "City 1 Updated"
    }
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn()
    };
};

describe("Unit Test Update Customer Use Case", () => {
    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const useCase = new UpdateCustomerUseCase(customerRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
});