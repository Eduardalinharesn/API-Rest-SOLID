import { GetUserMetricsUseCase } from '../get-users-metrics';
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase() {
  const chechInRepository = new PrismaCheckInRepository();
  const useCase = new ValidateCheckInUseCase(chechInRepository);

  return useCase;
}
