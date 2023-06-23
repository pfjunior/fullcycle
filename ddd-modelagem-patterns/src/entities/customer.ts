import Address from "./address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _addess!: Address;
    private _active: boolean = false;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    validateAddress(): boolean {
        if (this._addess === undefined) {
            return false;
        }
        return true;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    activate() {
        if (!this.validateAddress()) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    isActive(): boolean {
        return this._active;
    }

    addAddress(address: Address) {
        this._addess = address;
    }
}