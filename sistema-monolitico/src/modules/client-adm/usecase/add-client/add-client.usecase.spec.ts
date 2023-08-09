import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    };
};

describe("Add Client Usecase Unit Test", () => {
    it("should add a client", async () => {
        const repostory = MockRepository();
        const useCase = new AddClientUseCase(repostory);

        const input = {
            name: "Client 1",
            email: "client1@email.com",
            address: "Address 1"
        };

        const result = await useCase.execute(input);

        expect(repostory.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.address).toEqual(input.address);
    });
});