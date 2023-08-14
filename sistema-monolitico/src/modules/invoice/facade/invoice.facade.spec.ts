import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";

describe("Invoice Facade Test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
});