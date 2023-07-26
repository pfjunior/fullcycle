import CustomerFactory from "../../../domain/customer/factories/customer.factory";
import CustomerRepositoryInterface from "../../../domain/customer/interfaces/customer-repository.interface";
import Address from "../../../domain/customer/value-objects/address";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto";

export default class CreateCustomerUseCase {
    private _customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this._customerRepository = customerRepository;
    }

    async execute(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
        const customer = CustomerFactory.createWithAddress(input.name, new Address(input.address.street, input.address.number, input.address.zip, input.address.city));
        await this._customerRepository.create(customer);

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