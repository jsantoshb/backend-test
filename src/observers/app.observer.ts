import {LifeCycleObserver, lifeCycleObserver} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BrandRepository, ModelRepository} from '../repositories';
import {models} from '../seeds/models';


type SeedDataType = {
  id: number,
  name: string,
  average_price: number,
  brand_name: string
}
/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class TheSystemObserver implements LifeCycleObserver {
  constructor(
    @repository(ModelRepository)
    public modelRepository: ModelRepository,
    @repository(BrandRepository)
    protected brandRepository: BrandRepository,

  ) { }



  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {

    const dataExist = await this.brandRepository.exists(1);
    if (dataExist)
      return;

    console.log("Seed data update started")
    await this.insertSeedData()

  }


  async insertSeedData(): Promise<void> {
    let brands: string[] = models.map((seed: SeedDataType) => seed.brand_name)
    brands = [...new Set(brands)];

    for (let brand of brands) {

      const modelsByBrand = models.filter((model: SeedDataType) => model.brand_name == brand);

      const average = modelsByBrand.reduce((acc, value) => acc + value.average_price, 0) / modelsByBrand.length;

      const brandCreated = await this.brandRepository.create({
        name: brand,
        average_price: Number(average.toFixed(2))
      })

      const modelsToSave = modelsByBrand.map((model: SeedDataType) => ({
        name: model.name,
        average_price: model.average_price,
        brandId: brandCreated.id
      }))
      await this.modelRepository.createAll(modelsToSave);
    }

    console.log("Seed data update finished")
  }
}
