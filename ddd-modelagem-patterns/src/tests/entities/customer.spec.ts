import Address from "../../entities/address";
import Customer from "../../entities/customer";

describe("Customer Unit Test", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Bruce");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("c1", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        // arrange
        const customer = new Customer("c1", "Bruce");

        // act
        customer.changeName("Tony");

        // assert
        expect(customer.name).toBe("Tony");
    });

    it("should activate customer", () => {
        // arrange
        const customer = new Customer("c1", "Bruce");
        customer.addAddress(new Address("Mansion St", 1, "12345-678", "Gotham City"));

        // act
        customer.activate();

        // assert
        expect(customer.isActive()).toBe(true);
    });    

    it("should deactivate customer", () => {
        // arrange
        const customer = new Customer("c1", "Bruce");

        // act
        customer.deactivate();

        // assert
        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("c1", "Bruce");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
    });
});