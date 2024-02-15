import fastify, { FastifyInstance } from 'fastify';

import { verifyJWT } from '../middlewares/verify-jwt';
import { history } from './history';
import { metrics } from './metrics';
import { create } from './create';
import { validate } from './validate';
import { verifyRole } from '../middlewares/verify-user-role';

export async function CheckInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/check-ins/history', history),
    app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyRole('ADMIN')] },
    validate
  );
}
