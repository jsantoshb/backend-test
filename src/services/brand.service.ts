import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Brand, Model} from '../models';
import {BrandRepository, ModelRepository} from '../repositories';
import {ResponseService} from './response.service';

@injectable({scope: BindingScope.TRANSIENT})
export class BrandService {
  constructor(
    @repository(BrandRepository)
    protected brandRepository: BrandRepository,
    @repository(ModelRepository)
    public modelRepository: ModelRepository,
    @inject('response.service')
    private responseService: ResponseService
  ) { }

  async create(brand: Brand) {
    try {
      const brandExist = await this.brandRepository.findOne({where: {name: brand.name}});
      if (brandExist) return this.responseService.badRequest(`Brand ${brandExist.name} already exist`);

      return this.brandRepository.create(brand);
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async find() {
    try {
      return this.brandRepository.find();
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async findById(id: number) {
    await this.validateId(id)
    try {

      return this.brandRepository.findById(id);
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async findModelsByBrandId(id: number, filterParams?: {greater: number, lower: number}) {
    await this.validateId(id)
    try {

      return this.brandRepository.models(id).find(filterParams ? {where: {average_price: {between: [filterParams.greater, filterParams.lower]}}} : undefined);
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async updateById(id: number, brand: Brand) {
    await this.validateId(id)
    try {

      await this.brandRepository.updateById(id, brand);
      return this.responseService.ok();
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async postModelsByBrandId(id: number, model: Model) {

    await this.validateId(id)
    try {
      const modelExist = await this.modelRepository.findOne({where: {name: model.name, brandId: id}});
      if (modelExist) return this.responseService.badRequest(`Model ${model.name} already exist in this brand`);

      return this.brandRepository.models(id).create(model);
    } catch (error) {
      throw this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async deleteById(id: number) {
    await this.validateId(id)
    try {
      await this.brandRepository.deleteById(id)
      return this.responseService.ok();
    } catch (error) {
      return this.responseService.internalServerError(
        error.message ? error.message : error
      );
    }
  }

  async validateId(id: number) {
    const brandExist = await this.brandRepository.exists(id);
    if (!brandExist) throw this.responseService.notFound("the brand id doesn't exist");
  }
}
