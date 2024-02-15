import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserCase } from '../register';

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository();
  const registerUserCase = new RegisterUserCase(userRepository);

  return registerUserCase;
}
