import {inject} from '@loopback/core';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Brand, Model} from '../models';
import {BrandService} from '../services';

export class BrandController {
  constructor(
    @inject('brand.service')
    private brandService: BrandService
  ) { }

  @post('/brands')
  @response(200, {
    description: 'Brand model instance',
    content: {'application/json': {schema: getModelSchemaRef(Brand)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            title: 'NewBrand',
            exclude: ['id'],
          }),
        },
      },
    })
    brand: Omit<Brand, 'id'>,
  ): Promise<object> {
    return this.brandService.create(brand);
  }

  @get('/brands')
  @response(200, {
    description: 'Array of Brand model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Brand, {includeRelations: true}),
        },
      },
    },
  })
  async find(
  ): Promise<object> {
    return this.brandService.find();
  }

  @get('/brands/{id}')
  @response(200, {
    description: 'Brand model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Brand, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<object> {
    return this.brandService.findById(id);
  }


  @get('/brands/{id}/models', {
    responses: {
      '200': {
        description: 'Array of Brand has many Model',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Model)},
          },
        },
      },
    },
  })
  async findModels(
    @param.path.number('id') id: number,
    @param.query.integer('greater') greater?: number,
    @param.query.integer('lower') lower?: number,
  ): Promise<object> {
    return this.brandService.findModelsByBrandId(id, greater && lower ? {greater, lower} : undefined);
  }


  @del('/brands/{id}')
  @response(204, {
    description: 'Brand DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.brandService.deleteById(id);
  }

  @post('/brands/{id}/models', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Model)}},
      },
    },
  })
  async createModel(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Model, {
            title: 'NewModelInBrand',
            exclude: ['id'],
            optional: ['brandId', 'average_price']
          }),
        },
      },
    }) model: Omit<Model, 'id'>,
  ): Promise<object> {
    return this.brandService.postModelsByBrandId(id, model);
  }

}
