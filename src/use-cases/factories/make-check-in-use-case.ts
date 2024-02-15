import { PrismaGymRepositorys } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInUseCase } from '../check-in';
import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';

export function makeCheckInUseCase() {
  const chechInRepository = new PrismaCheckInRepository();
  const gymRepository = new PrismaGymRepositorys();
  const useCase = new CheckInUseCase(chechInRepository, gymRepository);

  return useCase;
}
