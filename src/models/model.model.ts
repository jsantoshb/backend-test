import {Entity, model, property} from '@loopback/repository';

@model()
export class Model extends Entity {
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

  @property({
    type: 'number',
  })
  brandId?: number;

  constructor(data?: Partial<Model>) {
    super(data);
  }
}

export interface ModelRelations {
  // describe navigational properties here
}

export type ModelWithRelations = Model & ModelRelations;
