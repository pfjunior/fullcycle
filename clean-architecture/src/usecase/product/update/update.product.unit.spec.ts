import ProductFactory from "../../../domain/product/factories/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.createProduct("Product 1", 100);

const input = {
    id: product.id,
    name: "Product 1 Updated",
    price: 200
};

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };
};

describe("Unit Test Update Produdct Use Case", () => {
    it("should update a product", async () => {
        const repository = MockRepository();
        const useCase = new UpdateProductUseCase(repository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
});