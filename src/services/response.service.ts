import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Response, RestBindings} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ResponseService {
  constructor(@inject(RestBindings.Http.RESPONSE) private response: Response) { }

  ok(data?: any) {
    return this.response.status(200).send(data ?? {message: 'success'});
  }

  badRequest(message: string) {
    return this.response.status(400).send({message});
  }

  notFound(message: string) {
    return this.response.status(404).send({message});
  }

  internalServerError(message: any) {
    return this.response.status(500).send({message});
  }

}
