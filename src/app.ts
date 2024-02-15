import fastify from 'fastify';
import { register } from './http/controllers/users/register';
import { UserRoutes } from './http/controllers/users/routes';
import { error } from 'console';
import { ZodError } from 'zod';
import cookie from '@fastify/cookie';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { GymRoutes } from './http/controllers/gyms/routes';
import { CheckInsRoutes } from './http/controllers/check-ins.ts/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(cookie);
app.register(UserRoutes);
app.register(GymRoutes);
app.register(CheckInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(488)
      .send({ message: 'Validation error', issues: error.format });
  }

  if (env.NODE_ENV != 'production') {
    console.error(error);
  } else {
    //log em uma ferramenta externa
  }

  return reply.status(500).send({ message: 'Internal server error' });
});
