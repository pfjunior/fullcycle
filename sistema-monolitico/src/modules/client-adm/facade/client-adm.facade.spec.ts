import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import Address from "../../shared/domain/value-object/address.value-object";

describe("ClientAdmFacade Test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const repository = new ClientRepository();
    const useCase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUseCase: useCase,
      findUseCase: undefined,
    });

    const client = {
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

    await facade.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id } });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toBe(client.document);
    expect(result.street).toBe(client.address.street);
  });

  it("should find a client", async () => {
    const repository = new ClientRepository();
    const addUseCase = new AddClientUseCase(repository);
    const findUseCase = new FindClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: findUseCase,
    });

    const client = {
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
    await facade.add(client);

    const result = await facade.find({ id: client.id });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toBe(client.document);
    expect(result.address.street).toBe(client.address.street);
  });

  it("should create a client using factory", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const client = {
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

    await facade.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id } });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toBe(client.document);
    expect(result.street).toBe(client.address.street);
  });

  it("should find a client with facatory", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const client = {
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
    await facade.add(client);

    const result = await facade.find({ id: client.id });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toBe(client.document);
    expect(result.address.street).toBe(client.address.street);
  });
});
