import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repositories/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repositories/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factories/product.factory";
import ListProductUseCase from "./list.product.usecase";

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
        const useCase = new ListProductUseCase(repository);

        const product1 = ProductFactory.createProduct("Product 1", 100);
        const product2 = ProductFactory.createProduct("Product 2", 200);
        repository.create(product1);
        repository.create(product2);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].price).toBe(product1.price);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    });
});