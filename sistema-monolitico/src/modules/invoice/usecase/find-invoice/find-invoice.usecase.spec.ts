import Id from "../../../shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("i1"),
    name: "cliente 01",
    document: "12345678910",
    address: new Address({
        street: "street 01",
        number: "101",
        complement: "complement 01",
        city: "city 01",
        state: "state 01",
        zipCode: "12345-678"
    }),
    items: [
        new InvoiceItems({
            name: "product 01",
            price: 100,
        })
    ]
});

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    };
};

describe("Find Invoice UseCase Unit Test", () => {
    it("should find a invoice", async () => {
        const repository = MockRepository();
        const useCase = new FindInvoiceUseCase(repository);

        const result = await useCase.execute({ id: invoice.id.id });

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.complement).toEqual(invoice.address.complement);
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
        expect(result.items.length).toBe(1);
        expect(result.createdAt).toStrictEqual(invoice.createdAt);
    });
});