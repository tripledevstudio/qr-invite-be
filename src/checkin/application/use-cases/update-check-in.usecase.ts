import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckInDto } from '../../dto/check-in.dto';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class UpdateCheckInUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(id: string, dto: Partial<CheckInDto>): Promise<CheckIn | undefined> {
    return this.repo.update(id, dto);
  }
}