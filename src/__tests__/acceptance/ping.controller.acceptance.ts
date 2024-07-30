import {Client, expect} from '@loopback/testlab';
import {BackendTestApplication} from '../..';
import {setupApplication} from './test-helper';

describe('Brand Controller', () => {
  let app: BackendTestApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /brands', async () => {
    const res = await client.get('/brands/1');
    expect(res.body).to.containEql({id: 1});
  });
});
