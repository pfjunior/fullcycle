import Address from "../../../shared/domain/value-object/address.value-object";
import Id from "../../../shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("c1"),
  name: "Client 1",
  email: "cliente1@email.com",
  document: "123.456.789-00",
  address: new Address(
    "Street 1",
    "101",
    "Complement 1",
    "City 1",
    "State 1",
    "12345-678"
  ),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find Client Usecase Unit Test", () => {
  it("should find a client", async () => {
    const repostory = MockRepository();
    const useCase = new FindClientUseCase(repostory);

    const result = await useCase.execute(client.id);

    expect(repostory.find).toHaveBeenCalled();
    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
  });
});
