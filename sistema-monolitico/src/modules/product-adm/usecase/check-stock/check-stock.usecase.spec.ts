import Id from "../../../shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Product 1 Description",
    purchasePrice: 100,
    stock: 10
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product))
    };
};

describe("CheckStock UseCase Unit Test", () => {
    it("should get stock of a product", async () => {
        const repository = MockRepository();
        const useCase = new CheckStockUseCase(repository);
        const input = { productId: product.id.id };

        const result = await useCase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.productId).toBe(product.id.id);
        expect(result.stock).toBe(product.stock);
    });
});