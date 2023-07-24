import Product from "../entities/product";
import RepositoryInterface from "../../shared/interfaces/repository.interface";

export default interface ProductRepositoryInterface extends RepositoryInterface<Product> { }