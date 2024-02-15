import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsErros } from './errors/invalid-credentials';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';

interface AuthenticateUserCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserCaseResponse {
  user: User;
}

export class AuthenticateUserCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse> {
    const user = await this.userRepository.findByEMail(email);

    if (!user) {
      throw new InvalidCredentialsErros();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsErros();
    }

    return { user };
  }
}
