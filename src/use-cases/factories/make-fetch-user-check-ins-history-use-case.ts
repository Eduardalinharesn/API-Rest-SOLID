import { fetchUserCheckInHistoryUseCase } from '../fetch-user-check-ins-history';
import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeFetchUserCheckInHistoryUseCase() {
  const chechInRepository = new PrismaCheckInRepository();
  const useCase = new fetchUserCheckInHistoryUseCase(chechInRepository);

  return useCase;
}
