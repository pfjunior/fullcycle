import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
    static create() {
        const repository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(repository);
        const checkStockUseCase = new CheckStockUseCase(repository);
        const productFacade = new ProductAdmFacade({
            addUseCase: addProductUseCase,
            stockUseCase: checkStockUseCase
        });

        return productFacade;
    }
}