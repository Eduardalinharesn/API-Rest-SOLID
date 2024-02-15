import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-use';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        tittle: 'Cool gym',
        latitude: -28.4812693,
        longitude: -49.0024865,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        tittle: 'Cool gym',
        description: 'descrição',
        phone: '00000000000',
        latitude: -28.4812693,
        longitude: -49.0024865,
      });

    expect(response.statusCode).toEqual(201);
  });
});
