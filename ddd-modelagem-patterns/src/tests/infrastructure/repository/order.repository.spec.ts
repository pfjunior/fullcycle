import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import OrderModel from "../../../infrastructure/db/sequelize/model/order.model";
import OrderItemModel from "../../../infrastructure/db/sequelize/model/order-item.model";
import ProductModel from "../../../infrastructure/db/sequelize/model/product.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import Customer from "../../../domain/entities/customer";
import Address from "../../../domain/entities/address";
import ProductRepository from "../../../infrastructure/repository/product.repository";
import Product from "../../../domain/entities/product";
import OrderItem from "../../../domain/entities/order_item";
import Order from "../../../domain/entities/order";
import OrderRepository from "../../../infrastructure/repository/order.repository";

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

        const order = new Order("o1", "c1", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "o1",
            customer_id: "c1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "o1",
                    product_id: "p1"
                }
            ]
        })
    });
});