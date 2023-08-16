import Id from "../../../shared/domain/value-object/id.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../domain/address.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {
    constructor(private repository: InvoiceGateway) { }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const _items = input.items.map((item) => {
            return new InvoiceItem({
                name: item.name,
                price: item.price
            });
        });

        const invoice = new Invoice({
            id: new Id(),
            name: input.name,
            document: input.document,
            address: new Address({
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode
            }),
            items: _items
        });

        await this.repository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                };
            }),
            total: invoice.total()
        };
    }
}