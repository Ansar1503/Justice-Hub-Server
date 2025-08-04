import { v4 as uuidv4 } from "uuid";

type RoleType = "lawyer" | "client" | "admin";

interface PersistedUserProps {
  id: string;
  user_id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: RoleType;
  is_blocked: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserProps {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: RoleType;
}

export class User {
  private _id: string;
  private _user_id: string;
  private _name: string;
  private _email: string;
  private _mobile: string;
  private _password: string;
  private _role: RoleType;
  private _is_blocked: boolean;
  private _is_verified: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedUserProps) {
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

  static create(props: CreateUserProps): User {
    const now = new Date();
    return new User({
      id: uuidv4(),
      user_id: `user-${uuidv4()}`,
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

  static fromPersistence(props: PersistedUserProps): User {
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
  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._user_id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get mobile(): string {
    return this._mobile;
  }

  get password(): string {
    return this._password;
  }

  get role(): RoleType {
    return this._role;
  }

  get is_blocked(): boolean {
    return this._is_blocked;
  }

  get is_verified(): boolean {
    return this._is_verified;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Methods
  verify(): void {
    this._is_verified = true;
    this.touch();
  }

  block(): void {
    this._is_blocked = true;
    this.touch();
  }

  unblock(): void {
    this._is_blocked = false;
    this.touch();
  }

  changePassword(newPassword: string): void {
    this._password = newPassword;
    this.touch();
  }

  updateEmail(newEmail: string): void {
    this._email = newEmail;
    this.touch();
  }

  updateName(newName: string): void {
    this._name = newName;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
