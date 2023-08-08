import Product from "../domain/product.entity";

export default interface ProductGateway {
    findall(): Promise<Product[]>;
    find(id: string): Promise<Product>;
}