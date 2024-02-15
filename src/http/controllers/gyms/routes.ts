import fastify, { FastifyInstance } from 'fastify';

import { verifyJWT } from '../middlewares/verify-jwt';
import { search } from './search';
import { nearby } from './nearby';
import { create } from './create';
import { verifyRole } from '../middlewares/verify-user-role';

export async function GymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);

  app.post('/gyms', { onRequest: [verifyRole('ADMIN')] }, create);
}
