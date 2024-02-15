import { expect, afterEach, describe, it, beforeEach, vi } from 'vitest';

import { InMomoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMomoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkin-error';
import { MaxDistanceError } from './errors/max-distance-error';
import { fetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history';

let checkInSRepository: InMomoryCheckInsRepository;
let sut: fetchUserCheckInHistoryUseCase;

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInSRepository = new InMomoryCheckInsRepository();
    sut = new fetchUserCheckInHistoryUseCase(checkInSRepository);
  });

  it('should be able to fetch check-in history', async () => {
    await checkInSRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInSRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInSRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
