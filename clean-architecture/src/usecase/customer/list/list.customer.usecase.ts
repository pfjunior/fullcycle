import CustomerRepositoryInterface from "../../../domain/customer/interfaces/customer-repository.interface";
import { InputListCustomerDto, OutputListCustomerDto } from "./list.customer.dto";
import { OutputMapper } from "./output.mapper";

export default class ListCustomerUseCase {
    private _customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this._customerRepository = customerRepository;
    }

    async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
        const customers = await this._customerRepository.findAll();

        return OutputMapper.toOutput(customers);
    }
}