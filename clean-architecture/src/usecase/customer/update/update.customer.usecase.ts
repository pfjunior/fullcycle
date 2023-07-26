import CustomerRepositoryInterface from "../../../domain/customer/interfaces/customer-repository.interface";
import Address from "../../../domain/customer/value-objects/address";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./update.customer.dto";

export default class UpdateCustomerUseCase {
    private _customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this._customerRepository = customerRepository;
    }

    async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
        const customer = await this._customerRepository.find(input.id);
        customer.changeName(input.name);
        customer.changeAddress(new Address(input.address.street, input.address.number, input.address.zip, input.address.city));
        await this._customerRepository.update(customer);

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