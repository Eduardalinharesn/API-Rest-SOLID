import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserCase } from '../register';
import { AuthenticateUserCase } from '../authenticate';

export function makeAuthenticadeUseCase() {
  const userRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUserCase(userRepository);

  return authenticateUseCase;
}
