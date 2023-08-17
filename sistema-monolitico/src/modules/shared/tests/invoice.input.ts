import Address from "../../invoice/domain/address.value-object";
import InvoiceItem from "../../invoice/domain/invoice-item.entity";
import Invoice from "../../invoice/domain/invoice.entity";
import Id from "../domain/value-object/id.value-object";

export default class InvoiceInput {
    static item1 = new InvoiceItem({
        id: new Id("p01"),
        name: "product 01",
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    static item2 = new InvoiceItem({
        id: new Id("p02"),
        name: "product 02",
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    static input = new Invoice({
        id: new Id("i1"),
        name: "client 01",
        document: "12345678910",
        address: new Address({
            street: "street 01",
            number: "101",
            complement: "Complement 01",
            city: "city 01",
            state: "state 01",
            zipCode: "12345-678",
        }),
        items: [InvoiceInput.item1, InvoiceInput.item2],
        createdAt: new Date(),
        updatedAt: new Date()
    });

    static inputUseCase = {
        name: "cliente 01",
        document: "12345678910",
        street: "street 01",
        number: "101",
        complement: "Complement 01",
        city: "city 01",
        state: "state 01",
        zipCode: "12345-678",
        items: [
            {
                id: "p01",
                name: "product 01",
                price: 100,
            },
            {
                id: "p02",
                name: "product 02",
                price: 200,
            },
        ]
    };
}