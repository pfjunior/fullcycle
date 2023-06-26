import Order from "../../entities/order";
import OrderItem from "../../entities/order_item";
import OrderService from "../../services/order.service";

describe("Order Service Unit Test", () => {
    it("should get total of all orders", () => {
        const item1 = new OrderItem("i1", "Item 01", 100, "p1", 1);
        const item2 = new OrderItem("i2", "Item 02", 200, "p2", 2);

        const order1 = new Order("o1", "c1", [item1]);
        const order2 = new Order("o2", "c1", [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    });
});