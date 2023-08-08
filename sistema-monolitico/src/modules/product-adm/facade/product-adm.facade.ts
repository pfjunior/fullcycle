import UseCaseInterface from "../../shared/usecase/use-case.interface";
import { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.dto.facade.interace";
import ProducAdmFacadeInterface from "./product-adm.facade.interface";
import UseCaseProps from "./use-case-props.interface";

export default class ProductAdmFacade implements ProducAdmFacadeInterface {
    private _addUseCase: UseCaseInterface;
    private _stockUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._addUseCase = usecaseProps.addUseCase;
        this._stockUseCase = usecaseProps.stockUseCase;
    }

    addProduct(input: AddProductFacadeInputDto): Promise<void> {
        // caso o dto do caso de uso for diferente do dto da facade,
        // é necessário converter o dto da facade para o dto do caso de uso
        return this._addUseCase.execute(input);
    }

    checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
        return this._stockUseCase.execute(input);
    }

}