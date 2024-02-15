import { expect, test, describe, it, beforeEach } from 'vitest';
import { RegisterUserCase } from './register';

import { InMomoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUserCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsErros } from './errors/invalid-credentials';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResouceNotFoundError } from './errors/resource-not-foun-error';

let userRepository: InMomoryUserRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMomoryUserRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it('should be able get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'dudis',
      email: 'dudis@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual('dudis');
  });

  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResouceNotFoundError);
  });

  it('should be able to authenticate with wrong password', async () => {
    const usersRepository = new InMomoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    await usersRepository.create({
      name: 'dudis',
      email: 'dudis@gmail.com',
      password_hash: await hash('123456', 6),
    });

    expect(() =>
      sut.execute({
        email: 'dudis@gmail.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsErros);
  });
});
