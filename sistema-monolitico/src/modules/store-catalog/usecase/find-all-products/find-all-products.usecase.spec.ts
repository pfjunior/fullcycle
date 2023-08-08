import Id from "../../../shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Product 1 Description",
    salesPrice: 100
});

const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    description: "Product 2 Description",
    salesPrice: 200
});

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2]))
    };
};

describe("Find All Products Usecase Unit Test", () => {
    it("should find all products", async () => {
        const repository = MockRepository();
        const useCase = new FindAllProductsUseCase(repository);

        const result = await useCase.execute();

        expect(repository.findAll).toHaveBeenCalled();
        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe(product.id.id);
        expect(result.products[0].name).toBe(product.name);
        expect(result.products[0].description).toBe(product.description);
        expect(result.products[0].salesPrice).toBe(product.salesPrice);
        expect(result.products[1].id).toBe(product2.id.id);
        expect(result.products[1].name).toBe(product2.name);
        expect(result.products[1].description).toBe(product2.description);
        expect(result.products[1].salesPrice).toBe(product2.salesPrice);
    });
});