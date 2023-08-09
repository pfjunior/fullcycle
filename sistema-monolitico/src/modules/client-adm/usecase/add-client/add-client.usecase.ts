import Id from "../../../shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto";

export default class AddClientUseCase {
    private _repository: ClientGateway;

    constructor(repository: ClientGateway) {
        this._repository = repository;
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const client = new Client({
            id: new Id(input.id) || new Id(),
            name: input.name,
            email: input.email,
            address: input.address
        });
        this._repository.add(client)

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        };
    }
}