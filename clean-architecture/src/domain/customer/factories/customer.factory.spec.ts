import Address from "../value-objects/address";
import CustomerFactory from "./customer.factory";

describe("Customer Factory Unit Test", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("Customer 01");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 01");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer wtih an address", () => {
        const address = new Address("Street", 1, "12345-678", "City");
        let customer = CustomerFactory.createWithAddress("Customer 01", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 01");
        expect(customer.address).toBe(address);
    });
});