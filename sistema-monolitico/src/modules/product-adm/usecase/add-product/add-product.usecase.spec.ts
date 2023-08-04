const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
};

describe("Add Product Usecase Unit Test", () => {
    it("should add a product", async () => {
        const repository = MockRepository();
        const usecase = new AddProductUseCase(repository);

        const input = {
            name: "Product 1",
            description: "Product 1 Description",
            purchasePrice: 100,
            stock: 10
        };

        usecase.execute(input);

        // output
    });
});