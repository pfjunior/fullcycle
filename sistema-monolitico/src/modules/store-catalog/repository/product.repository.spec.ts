import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

describe("Product Repository Test", () => {
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

    it("should find a product", async () => {
        const product = await ProductModel.create({
            id: "p1",
            name: "Product 1",
            description: "Product 1 Description",
            salesPrice: 100,
        });

        const product2 = await ProductModel.create({
            id: "p2",
            name: "Product 2",
            description: "Product 2 Description",
            salesPrice: 200,
        });

        const repository = new ProductRepository();
        const products = await repository.findAll();

        expect(products.length).toBe(2);
        expect(products[0].id.id).toBe(product.id);
        expect(products[0].name).toBe(product.name);
        expect(products[0].description).toBe(product.description);
        expect(products[0].salesPrice).toBe(product.salesPrice);
        expect(products[1].id.id).toBe(product2.id);
        expect(products[1].name).toBe(product2.name);
        expect(products[1].description).toBe(product2.description);
        expect(products[1].salesPrice).toBe(product2.salesPrice);
    });

    it("should find a product", async () => {
        const product = await ProductModel.create({
            id: "p1",
            name: "Product 1",
            description: "Product 1 Description",
            salesPrice: 100,
        });

        const repository = new ProductRepository();
        const result = await repository.find(product.id);

        expect(result.id.id).toBe(product.id);
        expect(result.name).toBe(product.name);
        expect(result.description).toBe(product.description);
        expect(result.salesPrice).toBe(product.salesPrice);
    });
});