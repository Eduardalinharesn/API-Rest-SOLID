import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exist';
import { User } from '@prisma/client';

interface RegisterUserCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserCaseResponse {
  user: User;
}

export class RegisterUserCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    name,
    email,
    password,
  }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEMail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    //const prismaUsersRepository = new PrismaUsersRepository();

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
