import Address from "../../../shared/domain/value-object/address.value-object";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client Usecase Unit Test", () => {
  it("should add a client", async () => {
    const repostory = MockRepository();
    const useCase = new AddClientUseCase(repostory);

    const input = {
      id: "c1",
      name: "Client 1",
      email: "client1@email.com",
      document: "123.456.789-00",
      address: new Address(
        "Street 1",
        "101",
        "Complement 1",
        "City 1",
        "State 1",
        "12345-678"
      ),
    };

    const result = await useCase.execute(input);

    expect(repostory.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  });
});
