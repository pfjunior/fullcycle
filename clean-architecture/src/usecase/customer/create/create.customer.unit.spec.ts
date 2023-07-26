import CreateCustomerUseCase from "./create.customer.usecase";

const input = {
    name: "Customer 1",
    address: {
        street: "Street 1",
        number: 1,
        zip: "12345-678",
        city: "City 1"
    }
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};

describe("Unit Test Create Customer Use Case", () => {
    it("should create a customer", async () => {
        const customerRepository = MockRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city
            }
        });
    });

    it("should thrown an error when a name is missing", async () => {
        const customerRepository = MockRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should thrown an error when a street is missing", async () => {
        const customerRepository = MockRepository();
        const useCase = new CreateCustomerUseCase(customerRepository);

        input.address.street = "";

        await expect(useCase.execute(input)).rejects.toThrow("Street is required");
    });
});