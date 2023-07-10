import { Sequelize } from "sequelize-typescript";
import Order from "../../domain/checkout/entities/order";
import OrderItem from "../../domain/checkout/entities/order_item";
import Customer from "../../domain/customer/entities/customer";
import Address from "../../domain/customer/value-objects/address";
import Product from "../../domain/product/entities/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order Repository Test", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("should creater a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 01", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);

        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: orderItem.productId
                }
            ]
        })
    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 01", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);

        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderItem2 = new OrderItem("i1", product.name, product.price, product.id, 4);
        const order2 = new Order("o1", customer.id, [orderItem2]);
        await orderRepository.update(order2);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order2.id,
            customer_id: order2.customerId,
            total: order2.total(),
            items: [
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order2.id,
                    product_id: orderItem2.productId
                }
            ]
        })
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 01", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);

        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 01");
        customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 01", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("i1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("i2", product.name, product.price, product.id, 2);
        const orderItem3 = new OrderItem("i3", product.name, product.price, product.id, 2);

        const order = new Order("o1", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const order2 = new Order("o2", customer.id, [orderItem2, orderItem3]);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();
        const orders = [order, order2];

        expect(orders).toEqual(foundOrders);
        expect(foundOrders).toHaveLength(2);
    });
});