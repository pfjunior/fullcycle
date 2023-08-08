import Id from "../../../shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Product 1 Description",
    salesPrice: 100
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve([product])),
        findAll: jest.fn()
    };
};

describe("Find Product Usecase Unit Test", () => {
    it("should find a product", async () => {
        const repository = MockRepository();
        const useCase = new FindProductUseCase(repository);

        const input = { id: product.id.id }

        const result = await useCase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.products.length).toBe(2);
        expect(result.products.id).toBe(product.id.id);
        expect(result.products.name).toBe(product.name);
        expect(result.products.description).toBe(product.description);
        expect(result.products.salesPrice).toBe(product.salesPrice);
    });
});