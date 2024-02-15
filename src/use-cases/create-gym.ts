import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import { GymsRepository } from '@/repositories/gym-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exist';
import { Gym } from '@prisma/client';

interface CreateGymUseCaseRequest {
  tittle: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymsRepository) {}
  async execute({
    tittle,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      tittle,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
