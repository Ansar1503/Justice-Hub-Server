"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    _id;
    _user_id;
    _name;
    _email;
    _mobile;
    _password;
    _role;
    _is_blocked;
    _is_verified;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._user_id = props.user_id;
        this._name = props.name;
        this._email = props.email;
        this._mobile = props.mobile;
        this._password = props.password;
        this._role = props.role;
        this._is_blocked = props.is_blocked;
        this._is_verified = props.is_verified;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new User({
            id: (0, uuid_1.v4)(),
            user_id: `user-${(0, uuid_1.v4)()}`,
            name: props.name,
            email: props.email,
            mobile: props.mobile,
            password: props.password,
            role: props.role,
            is_blocked: false,
            is_verified: false,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new User(props);
    }
    // toPersistence(): PersistedUserProps {
    //   return {
    //     id: this._id,
    //     user_id: this._user_id,
    //     name: this._name,
    //     email: this._email,
    //     mobile: this._mobile,
    //     password: this._password,
    //     role: this._role,
    //     is_blocked: this._is_blocked,
    //     is_verified: this._is_verified,
    //     createdAt: this._createdAt,
    //     updatedAt: this._updatedAt,
    //   };
    // }
    // Getters
    get id() {
        return this._id;
    }
    get user_id() {
        return this._user_id;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get mobile() {
        return this._mobile;
    }
    get password() {
        return this._password;
    }
    get role() {
        return this._role;
    }
    get is_blocked() {
        return this._is_blocked;
    }
    get is_verified() {
        return this._is_verified;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // Business Methods
    verify() {
        this._is_verified = true;
        this.touch();
    }
    block() {
        this._is_blocked = true;
        this.touch();
    }
    unblock() {
        this._is_blocked = false;
        this.touch();
    }
    changePassword(newPassword) {
        this._password = newPassword;
        this.touch();
    }
    updateEmail(newEmail) {
        this._email = newEmail;
        this.touch();
    }
    updateName(newName) {
        this._name = newName;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.User = User;
