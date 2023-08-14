import BaseEntity from "../../shared/domain/entities/base.entity";
import Id from "../../shared/domain/value-object/id.value-object";

type InvoiceItemsProps = {
    id?: Id;
    name: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class InvoiceItems extends BaseEntity {
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemsProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._price = props.price;

        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    validate(): void {
        if (this._price <= 0) {
            throw new Error("Price must be greater than zero");
        }
    }
}