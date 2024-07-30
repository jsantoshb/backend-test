import {inject} from '@loopback/core';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Model} from '../models';
import {ModelService} from '../services';

export class ModelController {
  constructor(
    @inject('model.service')
    private modelService: ModelService
  ) { }

  @get('/models')
  @response(200, {
    description: 'Array of Model model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Model, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.integer('greater') greater: number,
    @param.query.integer('lower') lower: number,
  ): Promise<object> {
    return this.modelService.find(greater && lower ? {greater, lower} : undefined)
  }

  @get('/models/{id}')
  @response(200, {
    description: 'Model model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Model, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<object> {
    return this.modelService.findById(id)
  }

  @put('/models/{id}')
  @response(204, {
    description: 'Model PUT success',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Model, {
          title: 'Edit model',
          exclude: ['id'],
          optional: ['name', 'average_price', 'brandId']
        }),
      }
    }
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() model: Partial<Model>,
  ): Promise<void> {
    await this.modelService.updateById(id, model);
  }

  @del('/models/{id}')
  @response(204, {
    description: 'Model DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.modelService.deleteById(id);
  }
}
