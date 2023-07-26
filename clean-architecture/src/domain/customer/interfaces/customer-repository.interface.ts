import Customer from "../entities/customer";
import RepositoryInterface from "../../shared/interfaces/repository.interface";

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> { }