import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';
import { SearchGymsUseCase } from '../search-gyms';
import { PrismaGymRepositorys } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymRepositorys();
  const useCase = new SearchGymsUseCase(gymsRepository);

  return useCase;
}
