class Customer {
    _id: string;
    _name: string;
    _addess: string;
    _active: boolean = false;

    constructor(id: string, name: string, address: string) {
        this._id = id;
        this._name = name;
        this._addess = address;
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
        if (this._addess.length === 0) {
            return true;
        }
        return false;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    activate() {
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }
}