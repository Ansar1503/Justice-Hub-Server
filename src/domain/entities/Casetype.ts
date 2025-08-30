import { v4 as uuidv4 } from "uuid";

interface persistedCasetypes {
  id: string;
  name: string;
  practiceareaId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface createCasetypeProps {
  name: string;
  practiceareaId: string;
}

export class Casetype {
  private _id: string;
  private _name: string;
  private _practiceareaId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  constructor(props: persistedCasetypes) {
    this._id = props.id;
    this._name = props.name;
    this._practiceareaId = props.practiceareaId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get practiceareaId() {
    return this._practiceareaId;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  static create(props: createCasetypeProps) {
    const now = new Date();
    return new Casetype({
      id: `ct-${uuidv4()}`,
      name: props.name,
      practiceareaId: props.practiceareaId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistance(props: persistedCasetypes) {
    return new Casetype(props);
  }

  updateName(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  updatePracticeareaId(id: string) {
    this._practiceareaId = id;
    this._updatedAt = new Date();
  }
}
