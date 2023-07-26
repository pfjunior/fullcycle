import Product from "../entities/product";
import ProductB from "../entities/product-b";
import ProductInterface from "../entities/product.interface";
import { v4 as uuid } from "uuid";

export default class ProductFactory {
    public static create(type: string, name: string, price: number): ProductInterface {
        switch (type) {
            case "a":
                return new Product(uuid(), name, price);
            case "b":
                return new ProductB(uuid(), name, price);
            default:
                throw new Error("Product type not supported");
        }
    }

    public static createProduct(name: string, price: number): Product {
        return new Product(uuid(), name, price);
    }
}