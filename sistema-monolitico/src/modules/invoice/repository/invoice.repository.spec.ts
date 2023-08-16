import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceInput from "../../shared/tests/invoice.input";

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
        await repository.generate(InvoiceInput.input);

        const result = await InvoiceModel.findOne({ where: { id: InvoiceInput.input.id.id }, include: ["items"] });

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(InvoiceInput.input.name);
        expect(result.document).toEqual(InvoiceInput.input.document);
        expect(result.street).toEqual(InvoiceInput.input.address.street);
        expect(result.number).toEqual(InvoiceInput.input.address.number);
        expect(result.complement).toEqual(InvoiceInput.input.address.complement);
        expect(result.city).toEqual(InvoiceInput.input.address.city);
        expect(result.state).toEqual(InvoiceInput.input.address.state);
        expect(result.zipCode).toEqual(InvoiceInput.input.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(InvoiceInput.input.items[0].id.id);
        expect(result.items[0].name).toEqual(InvoiceInput.input.items[0].name);
        expect(result.items[0].price).toEqual(InvoiceInput.input.items[0].price);
        expect(result.items[1].id).toEqual(InvoiceInput.input.items[1].id.id);
        expect(result.items[1].name).toEqual(InvoiceInput.input.items[1].name);
        expect(result.items[1].price).toEqual(InvoiceInput.input.items[1].price);
    });

    it("should find an invoice", async () => {
        await InvoiceModel.create(
            {
                id: InvoiceInput.input.id.id,
                name: InvoiceInput.input.name,
                document: InvoiceInput.input.document,
                street: InvoiceInput.input.address.street,
                number: InvoiceInput.input.address.number,
                complement: InvoiceInput.input.address.complement,
                city: InvoiceInput.input.address.city,
                state: InvoiceInput.input.address.state,
                zipCode: InvoiceInput.input.address.zipCode,
                items: InvoiceInput.input.items.map((item) => {
                    return {
                        id: item.id.id,
                        name: item.name,
                        price: item.price,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    };
                }),
                createdAt: InvoiceInput.input.createdAt,
                updatedAt: InvoiceInput.input.updatedAt
            },
            {
                include: [{ model: InvoiceItemModel }]
            }
        );

        const repository = new InvoiceRepository();
        const result = await repository.find(InvoiceInput.input.id.id);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(InvoiceInput.input.name);
        expect(result.document).toEqual(InvoiceInput.input.document);
        expect(result.address.street).toEqual(InvoiceInput.input.address.street);
        expect(result.address.number).toEqual(InvoiceInput.input.address.number);
        expect(result.address.complement).toEqual(InvoiceInput.input.address.complement);
        expect(result.address.city).toEqual(InvoiceInput.input.address.city);
        expect(result.address.state).toEqual(InvoiceInput.input.address.state);
        expect(result.address.zipCode).toEqual(InvoiceInput.input.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual(InvoiceInput.input.items[0].id.id);
        expect(result.items[0].name).toEqual(InvoiceInput.input.items[0].name);
        expect(result.items[0].price).toEqual(InvoiceInput.input.items[0].price);
        expect(result.items[1].id.id).toEqual(InvoiceInput.input.items[1].id.id);
        expect(result.items[1].name).toEqual(InvoiceInput.input.items[1].name);
        expect(result.items[1].price).toEqual(InvoiceInput.input.items[1].price);
    });
});