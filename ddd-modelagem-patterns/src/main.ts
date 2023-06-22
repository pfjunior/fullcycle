import Address from "./entities/address";
import Customer from "./entities/customer";
import Order from "./entities/order";
import OrderItem from "./entities/order_item";

let customer = new Customer("c1", "Bruce Wayne");
const address = new Address("Mansion St", 1, "12345-678", "Gotham City");
customer.addAddress(address);
customer.activate();

const item1 = new OrderItem("i1", "Item 1", 10);
const item2 = new OrderItem("i2", "Item 2", 15);

const order = new Order("o1", "c1", [item1, item2]);