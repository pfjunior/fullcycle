import Product from "../../../domain/product/entities/product";
import { OutputListProductDto } from "./list.product.dto";

export class OutputMapper {
    public static toOutput(products: Product[]): OutputListProductDto {
        return {
            products: products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price
            }))
        };
    }
}