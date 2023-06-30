import Order from "../../../domain/entities/order";
import OrderItem from "../../../domain/entities/order_item";

describe("Order Unit Test", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "c1", []);
        }).toThrowError("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("o1", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when items is empty", () => {
        expect(() => {
            let order = new Order("o1", "c1", []);
        }).toThrowError("Items are required");
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i1", "Item 2", 200, "p2", 2);
        const order = new Order("o1", "c1", [item1]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("o1", "c1", [item1, item2]);
        total = order2.total();

        expect(total).toBe(600);
    });

    it("should throw error if the item quantity is less or equal than zero", () => {
        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "c1", [item]);
        }).toThrowError("Quantity must be greater than zero");
    });
});