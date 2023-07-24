import Address from "../../../../domain/customer/value-objects/address";
import Customer from "../../../../domain/customer/entities/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/interfaces/customer-repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address.street,
                number: entity.address.number,
                zipCode: entity.address.zip,
                city: entity.address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints
            },
            {
                where: {
                    id: entity.id
                }
            }
        );
    }
    async find(id: string): Promise<Customer> {
        let customerModel;

        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(id, customerModel.name);
        const address = new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city);
        customer.changeAddress(address);

        return customer;
    }
    async findAll(): Promise<Customer[]> {
        const customersModel = await CustomerModel.findAll();

        const customers = customersModel.map((customerModel) => {
            let customer = new Customer(customerModel.id, customerModel.name);
            customer.addRewardsPoints(customerModel.rewardPoints);
            customer.changeAddress(new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city));
            if (customerModel.active) { customer.activate() };

            return customer;
        });
        return customers;
    }
}