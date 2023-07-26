import ProductRepositoryInterface from "../../../domain/product/interfaces/product-repository.interface";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import { OutputMapper } from "./output.mapper";

export default class ListProductUseCase {
    private _repository: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this._repository = repository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this._repository.findAll();

        return OutputMapper.toOutput(products);
    }
}