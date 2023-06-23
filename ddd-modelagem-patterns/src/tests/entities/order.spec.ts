import Order from "../../entities/order";
import OrderItem from "../../entities/order_item";

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
        }).toThrowError("Items quantity must be greater than 0");
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("i1", "Item 1", 100);
        const item2 = new OrderItem("i1", "Item 2", 200);
        const order = new Order("o1", "c1", [item1]);

        let total = order.total();

        expect(total).toBe(100);

        const order2 = new Order("o1", "c1", [item1, item2]);
        total = order2.total();

        expect(total).toBe(300);
    });
});