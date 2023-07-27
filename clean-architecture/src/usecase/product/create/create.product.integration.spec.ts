import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repositories/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repositories/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

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
        const useCase = new CreateProductUseCase(repository);

        const input = {
            name: "Product 1",
            price: 100
        };

        const output = await useCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it("should thrown an error when a name is missing", async () => {
        const repository = new ProductRepository();
        const useCase = new CreateProductUseCase(repository);

        const input = {
            name: "",
            price: 100
        };

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");
    });
});