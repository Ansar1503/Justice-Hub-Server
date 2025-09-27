import { v4 as uuidv4 } from "uuid";

interface PersistedSpescializationProps {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

interface createProps {
    name: string;
}

export class Specialization {
    private _id: string;
    private _name: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    constructor(props: PersistedSpescializationProps) {
        this._id = props.id;
        this._name = props.name;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: createProps) {
        const now = new Date();
        return new Specialization({
            id: `sp-${uuidv4()}`,
            name: props.name,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersisted(props: PersistedSpescializationProps) {
        return new Specialization(props);
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    updateName(name: string) {
        this._name = name;
        this._updatedAt = new Date();
    }
}
