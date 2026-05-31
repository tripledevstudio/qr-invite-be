import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckInDto } from '../../dto/check-in.dto';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class CheckInUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(dto: CheckInDto): Promise<CheckIn> {
    return this.repo.checkIn(dto);
  }
}