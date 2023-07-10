import Order from "../../domain/checkout/entities/order";
import OrderItem from "../../domain/checkout/entities/order_item";
import OrderRepositoryInterface from "../../domain/checkout/interfaces/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                }))
            },
            {
                include: [{ model: OrderItemModel }]
            }
        );
    }

    async update(entity: Order): Promise<void> {
        const sequelize = OrderModel.sequelize;
        await sequelize.transaction(async (transaction) => {
            await OrderItemModel.destroy({ where: { order_id: entity.id }, transaction: transaction });
            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id
            }));
            await OrderItemModel.bulkCreate(items, { transaction: transaction });
            await OrderModel.update({ total: entity.total() }, { where: { id: entity.id }, transaction: transaction });
        });

    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({ where: { id }, include: ['items'], rejectOnEmpty: true });

        } catch (error) {
            throw new Error("Order not found");
        }
        return new Order(orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(order => new OrderItem(
                order.id,
                order.name,
                order.price,
                order.product_id,
                order.quantity
            ))
        );
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: ["items"] });
        let orders: Order[] = [];

        orderModels.forEach((orderModel) => {
            let items: OrderItem[] = [];
            orderModel.items.forEach((item) => {
                let orderItem = new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity);
                items.push(orderItem);
            });

            let order = new Order(orderModel.id, orderModel.customer_id, items);
            orders.push(order);
        });
        return orders
    }
}