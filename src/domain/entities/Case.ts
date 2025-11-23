import { v4 as uuidv4 } from "uuid";

type StatusType = "open" | "closed" | "onhold";
interface PersistedCaseProps {
    id: string;
    title: string;
    clientId: string;
    lawyerId: string;
    caseType: string;
    status: StatusType;
    summary?: string;
    estimatedValue?: number;
    nextHearing?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateCaseProps {
    title: string;
    clientId: string;
    lawyerId: string;
    caseType: string;
    summary?: string;
}

export class Case {
    private _id: string;
    private _title: string;
    private _clientId: string;
    private _lawyerId: string;
    private _caseType: string;
    private _summary?: string;
    private _status: StatusType;
    private _estimatedValue?: number;
    private _nextHearing?: Date;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: PersistedCaseProps) {
        this._id = props.id;
        this._title = props.title;
        this._clientId = props.clientId;
        this._lawyerId = props.lawyerId;
        this._caseType = props.caseType;
        this._summary = props.summary;
        this._estimatedValue = props.estimatedValue;
        this._nextHearing = props.nextHearing;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: CreateCaseProps): Case {
        const now = new Date();
        return new Case({
            id: `case-${uuidv4()}`,
            title: props.title,
            clientId: props.clientId,
            lawyerId: props.lawyerId,
            caseType: props.caseType,
            summary: props.summary,
            status: "open",
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistance(props: PersistedCaseProps) {
        return new Case(props);
    }

    get id() {
        return this._id;
    }

    get estimatedValue() {
        return this._estimatedValue;
    }

    get nextHearing() {
        return this._nextHearing;
    }

    get status() {
        return this._status;
    }

    get title() {
        return this._title;
    }

    get clientId() {
        return this._clientId;
    }

    get lawyerId() {
        return this._lawyerId;
    }

    get caseType() {
        return this._caseType;
    }

    get summary() {
        return this._summary;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    updateSummary(summary: string) {
        this._summary = summary;
        this._updatedAt = new Date();
    }
    putOnHold() {
        this._status = "onhold";
        this._updatedAt = new Date();
    }

    reopenCase() {
        if (this._status === "closed") {
            this._status = "open";
            this._updatedAt = new Date();
        }
    }
    closeCase() {
        this._status = "closed";
        this._updatedAt = new Date();
    }
}
