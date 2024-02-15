import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { makeFetchUserCheckInHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQueryBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQueryBodySchema.parse(request.query);

  const history = makeFetchUserCheckInHistoryUseCase();

  const { checkIns } = await history.execute({
    userId: request.user.sub,
    page: page,
  });

  return reply.status(200).send({ checkIns });
}
