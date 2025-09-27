export interface IBaseRepository<TDomain> {
    create(entity: TDomain): Promise<TDomain>;
}
