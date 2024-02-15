import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    tittle: z.string(),
    description: z.string(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { tittle, description, phone, latitude, longitude } =
    registerBodySchema.parse(request.body);

  const gymUseCase = makeCreateGymUseCase();

  await gymUseCase.execute({
    tittle,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
