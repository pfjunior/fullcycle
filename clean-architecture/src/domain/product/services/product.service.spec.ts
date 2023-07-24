import Product from "../entities/product";
import ProductService from "./product.service";

describe("Product Service Unit Test", () => {
    it("Should change the prices of all products", () => {
        const product1 = new Product("p1", "Product 01", 10);
        const product2 = new Product("p2", "Product 02", 20);
        const products = [product1, product2];

        ProductService.increasePrice(products, 100);

        expect(product1.price).toBe(20);
        expect(product2.price).toBe(40);
    });
});