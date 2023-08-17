import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "p1",
            name: "Product 1",
            description: "Product 1 Description",
            purchasePrice: 100,
            stock: 10
        };

        await productFacade.addProduct(input);

        const result = await ProductModel.findOne({ where: { id: input.id } });

        expect(result).toBeDefined();
        expect(result.id).toBe(input.id);
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);
    });

    it("should check product stock", async () => {
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "p1",
            name: "Product 1",
            description: "Product 1 Description",
            purchasePrice: 100,
            stock: 10
        };

        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({ productId: input.id });

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);
    });
});