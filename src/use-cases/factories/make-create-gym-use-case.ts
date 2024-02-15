import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';
import { SearchGymsUseCase } from '../search-gyms';
import { PrismaGymRepositorys } from '@/repositories/prisma/prisma-gyms-repository';
import { CreateGymUseCase } from '../create-gym';

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymRepositorys();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
