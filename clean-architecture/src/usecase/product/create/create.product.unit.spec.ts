import CreateProductUseCase from "./create.product.usecase";

const input = {
    name: "Product 1",
    price: 100
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};

describe("Unit Test Create Product Use Case", () => {
    it("should create a product", async () => {
        const repository = MockRepository();
        const useCase = new CreateProductUseCase(repository);

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it("should thrown an error when a name is missing", async () => {
        const repository = MockRepository();
        const useCase = new CreateProductUseCase(repository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");
    });
});