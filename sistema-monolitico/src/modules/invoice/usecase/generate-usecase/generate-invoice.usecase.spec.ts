import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    };
};

describe("Invoice UseCase Unit Test", () => {
    it("should generate a invoice", async () => {
        const repository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(repository);

        const input = {
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

        const result = await useCase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.city).toEqual(input.city);
        expect(result.items.length).toBe(2);
    });
});