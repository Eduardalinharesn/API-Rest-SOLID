import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsErros } from './errors/invalid-credentials';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { ResouceNotFoundError } from './errors/resource-not-foun-error';

interface GetUserProfileUserCaseRequest {
  userId: string;
}

interface GetUserProfileUserCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUserCaseRequest): Promise<GetUserProfileUserCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResouceNotFoundError();
    }

    return { user };
  }
}
