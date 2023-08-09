import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import Client from "../domain/client.entity";
import Id from "../../shared/domain/value-object/id.value-object";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAdmFacade Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
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
            findUseCase: undefined
        });

        const client = {
            id: "c1",
            name: "Client 1",
            email: "client1@email.com",
            address: "Address 1",
        };

        await facade.add(client);

        const result = await ClientModel.findOne({ where: { id: client.id } });

        expect(result).toBeDefined();
        expect(result.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.address).toEqual(client.address);
    });
});