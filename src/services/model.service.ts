import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Model} from '../models';
import {BrandRepository, ModelRepository} from '../repositories';
import {ResponseService} from './response.service';

type ModelType = {
  name?: string,
  average_price?: number,
  branchId?: number
}

@injectable({scope: BindingScope.TRANSIENT})
export class ModelService {
  constructor(
    @repository(ModelRepository)
    public modelRepository: ModelRepository,
    @repository(BrandRepository)
    public brandRepository: BrandRepository,
    @inject('response.service')
    private responseService: ResponseService
  ) { }



  async find(filterParams?: {greater: number, lower: number}) {
    try {
      return this.modelRepository.find(filterParams ? {where: {average_price: {between: [filterParams.greater, filterParams.lower]}}} : undefined);
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async findById(id: number) {
    try {
      return this.modelRepository.findById(id);
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async updateById(id: number, model: Partial<Model>) {
    try {
      if (model.average_price != undefined && model.average_price < 100000)
        return this.responseService.badRequest('The average_price must be greater then 100,000.')

      const modelExist = await this.modelRepository.findById(id);
      if (!modelExist) this.responseService.notFound("the model id doesn't exist");

      if (modelExist.average_price != model.average_price)
        await this.UpdateBrandAveragePrice(modelExist.brandId!)

      await this.modelRepository.updateById(id, model);
      return this.responseService.ok();
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async deleteById(id: number) {
    try {
      await this.modelRepository.deleteById(id)
      return this.responseService.ok();
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async UpdateBrandAveragePrice(id: number) {
    const models = await this.modelRepository.find({where: {brandId: id}})
    const average_price = models.reduce((acc, value) => acc + (value.average_price ?? 0), 0) / models.length;
    await this.brandRepository.updateById(id, {average_price: Number(average_price.toFixed(2))})
  }
}
