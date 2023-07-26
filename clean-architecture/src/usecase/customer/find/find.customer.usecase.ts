import CustomerRepositoryInterface from "../../../domain/customer/interfaces/customer-repository.interface";
import { InputFindCustomerDto, OutputFindCustomerDto } from "./find.customer.dto";

export default class FindCustomerUseCase {
    private _customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this._customerRepository = customerRepository;
    }

    async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
        const customer = await this._customerRepository.find(input.id);

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                number: customer.address.number,
                zip: customer.address.zip,
                city: customer.address.city,
            }
        }
    }
}