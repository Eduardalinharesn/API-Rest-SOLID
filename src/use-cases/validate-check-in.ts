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
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validate-error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInSRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResouceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.is_validated = new Date();

    await this.checkInRepository.save(checkIn);

    return { checkIn };
  }
}
