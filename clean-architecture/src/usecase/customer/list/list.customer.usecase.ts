import CustomerRepositoryInterface from "../../../domain/customer/interfaces/customer-repository.interface";
import { InputListCustomerDto, OutputListCustomerDto } from "./list.customer.dto";

export default class ListCustomerUseCase {
    private _customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this._customerRepository = customerRepository;
    }

    async execute(): Promise<OutputListCustomerDto> {
        const customer = await this._customerRepository.findAll();

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                zip: customer.address.zip,
                city: customer.address.city
            }
        }
    }
}