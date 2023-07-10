import Customer from "../entities/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-objects/address";

export default class CustomerFactory {
    public static create(name: string): Customer {
        return new Customer(uuid(), name);
    }

    public static createWithAddress(name: string, address: Address): Customer {
        const customer = new Customer(uuid(), name);
        customer.changeAddress(address);

        return customer;
    }
}