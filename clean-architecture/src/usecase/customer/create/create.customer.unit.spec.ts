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

    it("should not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => { throw new Error("Customer not found") });
        const useCase = new FindCustomerUseCase(customerRepository);

        const input = { id: "c1" };

        expect(() => { return useCase.execute(input) }).rejects.toThrow("Customer not found");
    });
});