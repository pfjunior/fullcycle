import Product from "../../../domain/product/entities/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("p1", "Product 1", 100);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};

describe("Unit Test Find Prodcut Use Case", () => {
    it("should find a product", async () => {
        const repository = MockRepository();
        const useCase = new FindProductUseCase(repository);

        const input = { id: "p1" };

        const output = {
            id: "p1",
            name: "Product 1",
            price: 100
        };

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const repository = MockRepository();
        repository.find.mockImplementation(() => { throw new Error("Product not found") });
        const useCase = new FindProductUseCase(repository);

        const input = { id: "c1" };

        expect(() => { return useCase.execute(input) }).rejects.toThrow("Product not found");
    });
});