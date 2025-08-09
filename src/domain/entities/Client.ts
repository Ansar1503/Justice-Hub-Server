import { v4 as uuidv4 } from "uuid";

interface ClientProps {
  id: string;
  user_id: string;
  profile_image: string;
  dob: string;
  gender: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Client {
  private _id: string;
  private _user_id: string;
  private _profile_image: string;
  private _dob: string;
  private _gender: string;
  private _address: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  constructor(props: ClientProps) {
    this._id = props.id;
    this._user_id = props.user_id;
    this._profile_image = props.profile_image;
    this._dob = props.dob;
    this._gender = props.gender;
    this._address = props.address;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: Omit<ClientProps, "id" | "createdAt" | "updatedAt">) {
    const now = new Date();
    return new Client({
      ...props,
      id: uuidv4(),
      user_id: props.user_id,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistance(props: ClientProps): Client {
    return new Client(props);
  }

  get id() {
    return this._id;
  }
  get user_id() {
    return this._user_id;
  }
  get profile_image() {
    return this._profile_image;
  }
  get dob() {
    return this._dob;
  }
  get gender() {
    return this._gender;
  }
  get address() {
    return this._address;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  update(props: Partial<ClientProps>) {
    let changed = false;
    if (
      props.profile_image !== undefined &&
      props.profile_image !== null &&
      props.profile_image !== this._profile_image
    ) {
      this._profile_image = props.profile_image;
      changed = true;
    }
    if (
      props.dob !== undefined &&
      props.dob !== null &&
      props.dob !== props.dob
    ) {
      this._dob = props.dob;
      changed = true;
    }
    if (
      props.gender !== undefined &&
      props.gender !== null &&
      props.gender !== this._gender
    ) {
      this._gender = props.gender;
      changed = true;
    }
    if (
      props.address !== undefined &&
      props.address !== null &&
      props.address !== this._address
    ) {
      this._address = props.address;
      changed = true;
    }
    if (changed) {
      this._updatedAt = new Date();
    }
  }
}
