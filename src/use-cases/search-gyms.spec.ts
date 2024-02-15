import { expect, afterEach, describe, it, beforeEach, vi } from 'vitest';
import { fetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history';
import { InMomoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMomoryGymRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMomoryGymRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      tittle: 'Cool Gym',
      description: null,
      phone: null,
      latitude: -28.4812693,
      longitude: -49.0024865,
    });

    await gymsRepository.create({
      tittle: 'Nice Gym',
      description: null,
      phone: null,
      latitude: -28.4812693,
      longitude: -49.0024865,
    });

    const { gyms } = await sut.execute({
      query: 'Cool',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ tittle: 'Cool Gym' })]);
  });

  it.skip('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        tittle: `Nice Gym ${i}`,
        description: null,
        phone: null,
        latitude: -28.4812693,
        longitude: -49.0024865,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Nice',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ tittle: 'Nice Gym 21' }),
      expect.objectContaining({ tittle: 'Nice Gym 22' }),
    ]);
  });
});
