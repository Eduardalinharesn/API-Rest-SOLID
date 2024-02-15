import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import { GymsRepository } from '@/repositories/gym-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exist';
import { Gym } from '@prisma/client';

interface FecthcNearbyGymsUseCaseRequest {
  userLatitide: number;
  userLongitude: number;
}

interface FecthcNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FecthcNearbyGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}
  async execute({
    userLatitide,
    userLongitude,
  }: FecthcNearbyGymsUseCaseRequest): Promise<FecthcNearbyGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearBy({
      latitude: userLatitide,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
