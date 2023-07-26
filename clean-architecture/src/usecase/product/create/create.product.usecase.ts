import ProductFactory from "../../../domain/product/factories/product.factory";
import ProductRepositoryInterface from "../../../domain/product/interfaces/product-repository.interface";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";

export default class CreateProductUseCase {
    private _repository: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this._repository = repository;
    }

    async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
        const product = ProductFactory.createProduct(input.name, input.price);
        await this._repository.create(product);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        }
    }
}