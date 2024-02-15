import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { makeFetchNearByGymUseCase } from '@/use-cases/factories/make-fecth-nearby-gyms-use-case';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearByGymsQuerySchema.parse(request.query);

  const fecthNearBYGymUseCase = makeFetchNearByGymUseCase();

  const { gyms } = await fecthNearBYGymUseCase.execute({
    userLatitide: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
