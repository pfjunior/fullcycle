import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Id from "../../shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
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
    })

    it("should create a product", async () => {
        const props = {
            id: new Id(),
            name: "Product 1",
            description: "Product 1 Description",
            purchasePrice: 100,
            stock: 10
        };
        const product = new Product(props);
        const repository = new ProductRepository();
        await repository.add(product);

        const productDb = await ProductModel.findOne({ where: { id: props.id.id } });

        expect(props.id.id).toEqual(productDb.id);
        expect(props.name).toEqual(productDb.name);
        expect(props.description).toEqual(productDb.description);
        expect(props.purchasePrice).toEqual(productDb.purchasePrice);
        expect(props.stock).toEqual(productDb.stock);
    });

    it("should find a product", async () => {
        const repository = new ProductRepository();

        ProductModel.create({
            id: "p1",
            name: "Product 1",
            description: "Product 1 Description",
            purchasePrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const product = await repository.find("p1");

        expect(product.id.id).toEqual("p1");
        expect(product.name).toEqual("Product 1");
        expect(product.description).toEqual("Product 1 Description");
        expect(product.purchasePrice).toEqual(100);
        expect(product.stock).toEqual(10);
    });
});