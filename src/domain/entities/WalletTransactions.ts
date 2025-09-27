import { v4 as uuidv4 } from "uuid";

type transactionCategory = "deposit" | "withdrawal" | "payment" | "refund" | "transfer";
type transactionStatus = "pending" | "completed" | "failed" | "cancelled";
type transactionType = "debit" | "credit";

interface PersistedWalletTransactionProps {
    id: string;
    walletId: string;
    amount: number;
    type: transactionType;
    description: string;
    category: transactionCategory;
    status: transactionStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface createWalletTransactionProps {
    walletId: string;
    amount: number;
    type: transactionType;
    description: string;
    category: transactionCategory;
    status: transactionStatus;
}

export class WalletTransaction {
    private _id: string;
    private _walletId: string;
    private _amount: number;
    private _type: transactionType;
    private _description: string;
    private _category: transactionCategory;
    private _status: transactionStatus;
    private _createdAt: Date;
    private _updatedAt: Date;
    constructor(props: PersistedWalletTransactionProps) {
        this._id = props.id;
        this._walletId = props.walletId;
        this._amount = props.amount;
        this._type = props.type;
        this._description = props.description;
        this._category = props.category;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get status() {
        return this._status;
    }
    get id() {
        return this._id;
    }
    get walletId() {
        return this._walletId;
    }
    get amount() {
        return this._amount;
    }
    get type() {
        return this._type;
    }
    get description() {
        return this._description;
    }
    get category() {
        return this._category;
    }

    static create(props: createWalletTransactionProps) {
        const now = new Date();
        return new WalletTransaction({
            id: `wt-${uuidv4()}`,
            walletId: props.walletId,
            amount: props.amount,
            type: props.type,
            description: props.description,
            category: props.category,
            status: props.status,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersisted(props: PersistedWalletTransactionProps) {
        return new WalletTransaction(props);
    }
}
