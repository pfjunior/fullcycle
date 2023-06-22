import Address from "./address";

class Customer {
    _id: string;
    _name: string;
    _addess!: Address;
    _active: boolean = false;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
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

    addAddress(address: Address) {
        this._addess = address;
    }
}