export interface PersistedAddressProps {
  id: string;
  user_id: string;
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressProps {
  user_id: string;
  state?: string;
  city?: string;
  locality?: string;
  pincode?: string;
}

export class Address {
    private _id: string;
    private _user_id: string;
    private _state?: string;
    private _city?: string;
    private _locality?: string;
    private _pincode?: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PersistedAddressProps) {
        this._id = props.id;
        this._user_id = props.user_id;
        this._state = props.state;
        this._city = props.city;
        this._locality = props.locality;
        this._pincode = props.pincode;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: CreateAddressProps): Address {
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

    static fromPersistence(props: PersistedAddressProps): Address {
        return new Address(props);
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get user_id(): string {
        return this._user_id;
    }

    get state(): string | undefined {
        return this._state;
    }

    get city(): string | undefined {
        return this._city;
    }

    get locality(): string | undefined {
        return this._locality;
    }

    get pincode(): string | undefined {
        return this._pincode;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateAddress(fields: Partial<Omit<CreateAddressProps, "user_id">>) {
        let updated: boolean = false;
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

    private touch(): void {
        this._updatedAt = new Date();
    }
}
