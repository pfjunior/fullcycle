import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repositories/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repositories/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factories/product.factory";

describe("Test Find Product Use Case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const repository = new ProductRepository();
        const useCase = new UpdateProductUseCase(repository);
        const product = ProductFactory.createProduct("Product 1", 100);
        repository.create(product);

        const input = {
            id: product.id,
            name: "Product 1 Updated",
            price: 200
        };

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
});