import ProductRepositoryInterface from "../../../domain/product/interfaces/product-repository.interface";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";

export default class FindProductUseCase {
    private _repository: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this._repository = repository;
    }

    async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
        const product = await this._repository.find(input.id);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        }
    }
}