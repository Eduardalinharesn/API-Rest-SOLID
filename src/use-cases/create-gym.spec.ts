import { expect, test, describe, it, beforeEach } from 'vitest';
import { RegisterUserCase } from './register';
import { compare } from 'bcryptjs';
import { InMomoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exist';
import { InMomoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMomoryGymRepository;
let sut: CreateGymUseCase;
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMomoryGymRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it('should be able to create Gym', async () => {
    const { gym } = await sut.execute({
      tittle: 'Gym',
      description: null,
      phone: null,
      latitude: -28.4812693,
      longitude: -49.0024865,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
