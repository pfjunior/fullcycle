import Customer from "../../customer/entities/customer";
import Order from "../entities/order";
import OrderItem from "../entities/order_item";
import OrderService from "./order.service";

describe("Order Service Unit Test", () => {
    it("should get total of all orders", () => {
        const item1 = new OrderItem("i1", "Item 01", 100, "p1", 1);
        const item2 = new OrderItem("i2", "Item 02", 200, "p2", 2);

        const order1 = new Order("o1", "c1", [item1]);
        const order2 = new Order("o2", "c1", [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    });

    it("should place an order", () => {
        const customer = new Customer("c1", "Customer 1");
        const item1 = new OrderItem("i1", "Item 01", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should add reward points", () => {
        const customer = new Customer("c1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardsPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardsPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});