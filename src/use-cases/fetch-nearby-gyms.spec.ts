import { expect, afterEach, describe, it, beforeEach, vi } from 'vitest';
import { fetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history';
import { InMomoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FecthcNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMomoryGymRepository;
let sut: FecthcNearbyGymsUseCase;

describe('Fetch nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMomoryGymRepository();
    sut = new FecthcNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetche nearby gyms', async () => {
    await gymsRepository.create({
      tittle: 'Near Gym',
      description: null,
      phone: null,
      latitude: -28.4812693,
      longitude: -49.0024865,
    });

    await gymsRepository.create({
      tittle: 'Far Gym',
      description: null,
      phone: null,
      latitude: -28.3677635,
      longitude: -48.9606374,
    });

    const { gyms } = await sut.execute({
      userLatitide: -28.4812693,
      userLongitude: -49.0024865,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ tittle: 'Near Gym' })]);
  });
});
