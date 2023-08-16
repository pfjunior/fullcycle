import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "./invoice.facade";
import InvoiceInput from "../../shared/tests/invoice.input";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";

describe("Invoice Facade Test", () => {
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
        const useCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUseCase: useCase,
            findUseCase: undefined
        });

        const result = await facade.generate(InvoiceInput.inputUseCase);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(InvoiceInput.inputUseCase.name);
        expect(result.document).toEqual(InvoiceInput.inputUseCase.document);
        expect(result.street).toEqual(InvoiceInput.inputUseCase.street);
        expect(result.number).toEqual(InvoiceInput.inputUseCase.number);
        expect(result.complement).toEqual(InvoiceInput.inputUseCase.complement);
        expect(result.city).toEqual(InvoiceInput.inputUseCase.city);
        expect(result.state).toEqual(InvoiceInput.inputUseCase.state);
        expect(result.zipCode).toEqual(InvoiceInput.inputUseCase.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBeDefined();
        expect(result.items[0].name).toEqual(InvoiceInput.inputUseCase.items[0].name);
        expect(result.items[0].price).toEqual(InvoiceInput.inputUseCase.items[0].price);
        expect(result.items[1].id).toBeDefined();
        expect(result.items[1].name).toEqual(InvoiceInput.inputUseCase.items[1].name);
        expect(result.items[1].price).toEqual(InvoiceInput.inputUseCase.items[1].price);
    });

    it("should find an invoice", async () => {
        const input = await InvoiceModel.create(
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
        const useCase = new FindInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUseCase: undefined,
            findUseCase: useCase
        });
        const result = await facade.find(InvoiceInput.input.id);

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.address.street).toEqual(input.street);
        expect(result.address.number).toEqual(input.number);
        expect(result.address.complement).toEqual(input.complement);
        expect(result.address.city).toEqual(input.city);
        expect(result.address.state).toEqual(input.state);
        expect(result.address.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
    });
});