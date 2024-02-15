import { expect, afterEach, describe, it, beforeEach, vi } from 'vitest';

import { InMomoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMomoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkin-error';
import { MaxDistanceError } from './errors/max-distance-error';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResouceNotFoundError } from './errors/resource-not-foun-error';
import { LateCheckInValidationError } from './errors/late-check-in-validate-error';

let checkInSRepository: InMomoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInSRepository = new InMomoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInSRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInSRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.is_validated).toEqual(expect.any(Date));
    expect(checkInSRepository.items[0].is_validated).toEqual(expect.any(Date));
  });

  it('should no be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResouceNotFoundError);
  });

  it('should not be able to caliate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40));

    const createdCheckIn = await checkInSRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
