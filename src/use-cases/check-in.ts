import { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsErros } from './errors/invalid-credentials';
import { compare } from 'bcryptjs';
import { CheckIn } from '@prisma/client';
import { CheckInSRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gym-repository';
import { ResouceNotFoundError } from './errors/resource-not-foun-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-cordenates';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkin-error';
import { MaxDistanceError } from './errors/max-distance-error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInSRepository,
    private gymRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResouceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckinsError();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
