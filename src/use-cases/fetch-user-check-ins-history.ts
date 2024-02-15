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

interface fetchUserCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface fetchUserCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class fetchUserCheckInHistoryUseCase {
  constructor(private checkInRepository: CheckInSRepository) {}

  async execute({
    userId,
    page,
  }: fetchUserCheckInHistoryUseCaseRequest): Promise<fetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
