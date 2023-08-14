import InvoiceGateway from "../Gateway/invoice.gateway";
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
        throw new Error("Method not implemented.");
    }

}