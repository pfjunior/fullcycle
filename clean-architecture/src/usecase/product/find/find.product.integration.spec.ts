import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repositories/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repositories/sequelize/product.repository";
import Product from "../../../domain/product/entities/product";
import FindProductUseCase from "./find.product.usecase";

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

    it("should find a product", async () => {
        const repository = new ProductRepository();
        const usecase = new FindProductUseCase(repository);

        const product = new Product("p1", "Product 1", 100);

        await repository.create(product);

        const input = {
            id: "p1",
        };

        const output = {
            id: "p1",
            name: "Product 1",
            price: 100
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });
});