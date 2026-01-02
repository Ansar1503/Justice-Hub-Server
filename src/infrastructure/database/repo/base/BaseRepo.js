"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    mapper;
    session;
    constructor(model, mapper, session) {
        this.model = model;
        this.mapper = mapper;
        this.session = session;
    }
    async create(entity) {
        const persistence = this.mapper.toPersistence(entity);
        const doc = new this.model(persistence);
        const saved = await doc.save({ session: this.session }).catch((err) => {
            throw new Error(err.message);
        });
        return this.mapper.toDomain(saved.toObject());
    }
}
exports.BaseRepository = BaseRepository;
