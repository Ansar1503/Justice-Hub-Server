"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    _id;
    _user_id;
    _state;
    _city;
    _locality;
    _pincode;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._user_id = props.user_id;
        this._state = props.state;
        this._city = props.city;
        this._locality = props.locality;
        this._pincode = props.pincode;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Address({
            id: `ads-${crypto.randomUUID()}`,
            user_id: props.user_id,
            state: props.state,
            city: props.city,
            locality: props.locality,
            pincode: props.pincode,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Address(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get user_id() {
        return this._user_id;
    }
    get state() {
        return this._state;
    }
    get city() {
        return this._city;
    }
    get locality() {
        return this._locality;
    }
    get pincode() {
        return this._pincode;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateAddress(fields) {
        let updated = false;
        if (fields.state !== undefined) {
            this._state = fields.state;
            updated = true;
        }
        if (fields.city !== undefined) {
            this._city = fields.city;
            updated = true;
        }
        if (fields.locality !== undefined) {
            this._locality = fields.locality;
            updated = true;
        }
        if (fields.pincode !== undefined) {
            this._pincode = fields.pincode;
            updated = true;
        }
        if (updated) {
            this.touch();
        }
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Address = Address;
