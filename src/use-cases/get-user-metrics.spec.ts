import { expect, afterEach, describe, it, beforeEach, vi } from 'vitest';

import { InMomoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { fetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history';
import { GetUserMetricsUseCase } from './get-users-metrics';

let checkInSRepository: InMomoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User metrics Use Case', () => {
  beforeEach(async () => {
    checkInSRepository = new InMomoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInSRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    await checkInSRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInSRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
