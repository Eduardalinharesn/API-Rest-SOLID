import { expect, test, describe, it, beforeEach } from 'vitest';
import { RegisterUserCase } from './register';
import { compare } from 'bcryptjs';
import { InMomoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exist';

let userRepository: InMomoryUserRepository;
let sut: RegisterUserCase;
describe('register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMomoryUserRepository();
    sut = new RegisterUserCase(userRepository);
  });
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jonh',
      email: 'jonh@gmail.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  }),
    it('should hash user password upon registration', async () => {
      const { user } = await sut.execute({
        name: 'Jonh',
        email: 'jonh@gmail.com',
        password: '123456',
      });

      const isPasswordCorrectlyHashed = await compare(
        '123456',
        user.password_hash
      );

      expect(isPasswordCorrectlyHashed).toBe(true);
    }),
    it('should not be able to register with the same email twice', async () => {
      const email = 'duda@example.com';
      await sut.execute({
        name: 'Jonh',
        email: email,
        password: '123456',
      });

      await expect(() =>
        sut.execute({
          name: 'Jonh',
          email: email,
          password: '123456',
        })
      ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
