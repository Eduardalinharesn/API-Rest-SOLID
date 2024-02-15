import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-use';

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tittle: 'Cool gym',
        description: 'descrição',
        phone: '00000000000',
        latitude: -28.4828039,
        longitude: -49.0040521,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tittle: 'Nice gym',
        description: 'descrição',
        phone: '00000000000',
        latitude: -28.4828039,
        longitude: -49.0040521,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Cool gym',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        tittle: 'Cool gym',
      }),
    ]);
  });
});
