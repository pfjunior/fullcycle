import Entity from "../../shared/entities/entity.abstract";
import NotificationError from "../../shared/notification/notification.error";
import Address from "../value-objects/address";



export default class Customer extends Entity {
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get address(): Address {
        return this._address
    }

    validate() {
        if (this._id.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Id is required"
            });
        }
        if (this._name.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Name is required"
            })
        }
    }

    validateAddress(): boolean {
        if (this._address === undefined) {
            return false;
        }
        return true;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
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

    addRewardsPoints(points: number) {
        this._rewardPoints = this._rewardPoints + points;
    }
}