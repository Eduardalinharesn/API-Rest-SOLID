import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';
import { FecthcNearbyGymsUseCase } from '../fetch-nearby-gyms';
import { PrismaGymRepositorys } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearByGymUseCase() {
  const gymsRepository = new PrismaGymRepositorys();
  const useCase = new FecthcNearbyGymsUseCase(gymsRepository);

  return useCase;
}
