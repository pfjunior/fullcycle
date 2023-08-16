import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import Id from "../../shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";

const item1 = new InvoiceItem({
    id: new Id("p01"),
    name: "product 01",
    price: 100,
    createdAt: new Date(),
    updatedAt: new Date()
});

const item2 = new InvoiceItem({
    id: new Id("p02"),
    name: "product 02",
    price: 200,
    createdAt: new Date(),
    updatedAt: new Date()
});

const input = new Invoice({
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
    items: [item1, item2],
    createdAt: new Date(),
    updatedAt: new Date()
});


describe("Invoice Repository Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const repository = new InvoiceRepository();
        await repository.generate(input);

        const result = await InvoiceModel.findOne({ where: { id: input.id.id }, include: ["items"] });

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.address.street);
        expect(result.number).toEqual(input.address.number);
        expect(result.complement).toEqual(input.address.complement);
        expect(result.city).toEqual(input.address.city);
        expect(result.state).toEqual(input.address.state);
        expect(result.zipCode).toEqual(input.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(input.items[0].id.id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id.id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
    });

    it("should find an invoice", async () => {
        await InvoiceModel.create(
            {
                id: input.id.id,
                name: input.name,
                document: input.document,
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement,
                city: input.address.city,
                state: input.address.state,
                zipCode: input.address.zipCode,
                items: input.items.map((item) => {
                    return {
                        id: item.id.id,
                        name: item.name,
                        price: item.price,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    };
                }),
                createdAt: input.createdAt,
                updatedAt: input.updatedAt
            },
            {
                include: [{ model: InvoiceItemModel }]
            }
        );

        const repository = new InvoiceRepository();
        const result = await repository.find(input.id.id);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.address.street).toEqual(input.address.street);
        expect(result.address.number).toEqual(input.address.number);
        expect(result.address.complement).toEqual(input.address.complement);
        expect(result.address.city).toEqual(input.address.city);
        expect(result.address.state).toEqual(input.address.state);
        expect(result.address.zipCode).toEqual(input.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual(input.items[0].id.id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id.id).toEqual(input.items[1].id.id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
    });
});