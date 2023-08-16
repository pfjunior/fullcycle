import Id from "../../shared/domain/value-object/id.value-object";
import InvoiceGateway from "../Gateway/invoice.gateway";
import Address from "../domain/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
            {
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
                        price: item.price,
                        createdAt: invoice.createdAt,
                        updatedAt: invoice.updatedAt
                    };
                }),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
            },
            {
                include: [{ model: InvoiceItemModel }]
            }
        );
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({ where: { id }, include: [InvoiceItemModel] });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode
            }),
            items: invoice.items.map((item) => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });
    }

}