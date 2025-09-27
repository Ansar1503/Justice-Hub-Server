export interface IMapper<TDomain, TPersistence> {
    toPersistence(entity: TDomain): Partial<TPersistence>;
    toDomain(persistence: TPersistence): TDomain;
    toDomainArray?(persistence: TPersistence[]): TDomain[];
}
