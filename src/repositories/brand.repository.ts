import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Brand, BrandRelations, Model} from '../models';
import {ModelRepository} from './model.repository';

export class BrandRepository extends DefaultCrudRepository<
  Brand,
  typeof Brand.prototype.id,
  BrandRelations
> {

  public readonly models: HasManyRepositoryFactory<Model, typeof Brand.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ModelRepository') protected modelRepositoryGetter: Getter<ModelRepository>,
  ) {
    super(Brand, dataSource);
    this.models = this.createHasManyRepositoryFactoryFor('models', modelRepositoryGetter,);
    this.registerInclusionResolver('models', this.models.inclusionResolver);
  }
}
