import { v4 as uuidv4 } from "uuid";

interface persistedPracticeAreaProps {
  id: string;
  name: string;
  specializationId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface createProps {
  name: string;
  specializationId: string;
}

export class PracticeArea {
    private _id: string;
    private _name: string;
    private _specializationId: string;
    private _createdAt: Date;
    private _udpatedAt: Date;
    constructor(props: persistedPracticeAreaProps) {
        this._id = props.id;
        this._name = props.name;
        this._specializationId = props.specializationId;
        this._createdAt = props.createdAt;
        this._udpatedAt = props.updatedAt;
    }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._name;
    }
    get specializationId(): string {
        return this._specializationId;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get udpatedAt(): Date {
        return this._udpatedAt;
    }

    static create(props: createProps) {
        const now = new Date();
        return new PracticeArea({
            id: `pr-${uuidv4()}`,
            name: props.name,
            specializationId: props.specializationId,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersisted(props: persistedPracticeAreaProps) {
        return new PracticeArea(props);
    }

    updateName(name: string) {
        this._name = name;
        this._udpatedAt = new Date();
    }

    updateSpecialisation(id: string) {
        this._specializationId = id;
        this._udpatedAt = new Date();
    }
}
