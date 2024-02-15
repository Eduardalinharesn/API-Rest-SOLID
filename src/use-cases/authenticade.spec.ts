import { expect, test, describe, it, beforeEach } from 'vitest';
import { RegisterUserCase } from './register';

import { InMomoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUserCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsErros } from './errors/invalid-credentials';

let userRepository: InMomoryUserRepository;
let sut: AuthenticateUserCase;

describe('register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMomoryUserRepository();
    sut = new AuthenticateUserCase(userRepository);
  });

  it('should be able to authenticate', async () => {
    const usersRepository = new InMomoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    await usersRepository.create({
      name: 'dudis',
      email: 'dudis@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'dudis@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should be able to authenticate with wrong email', async () => {
    const usersRepository = new InMomoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: 'dudis@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsErros);
  });

  it('should be able to authenticate with wrong password', async () => {
    const usersRepository = new InMomoryUserRepository();
    const sut = new AuthenticateUserCase(usersRepository);

    await usersRepository.create({
      name: 'dudis',
      email: 'dudis@gmail.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'dudis@gmail.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsErros);
  });
});
