import Customer from "../../../domain/customer/entities/customer";
import { OutputListCustomerDto } from "./list.customer.dto";

export class OutputMapper {
    public static toOutput(customers: Customer[]): OutputListCustomerDto {
        return {
            customers: customers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.address.street,
                    number: customer.address.number,
                    zip: customer.address.zip,
                    city: customer.address.city
                }
            }))
        };
    }
}