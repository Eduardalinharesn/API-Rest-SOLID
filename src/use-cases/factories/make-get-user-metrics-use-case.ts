import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeGetUserMetricsUseCase() {
  const chechInRepository = new PrismaCheckInRepository();
  const useCase = new GetUserMetricsUseCase(chechInRepository);

  return useCase;
}
