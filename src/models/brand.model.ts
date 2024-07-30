import {Entity, hasMany, model, property} from '@loopback/repository';
import {Model} from './model.model';

@model()
export class Brand extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    postgresql: {
      dataType: 'float',
    },
    default: 0
  })
  average_price?: number;

  @hasMany(() => Model)
  models: Model[];

  constructor(data?: Partial<Brand>) {
    super(data);
  }
}

export interface BrandRelations {
  // describe navigational properties here
}

export type BrandWithRelations = Brand & BrandRelations;
