import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = new User({
      name: dto.name,
      email: dto.email,
      phone_number: dto.phone_number,
      ref_code: dto.ref_code,
      invite_code: dto.invite_code,
      rank: dto.rank,
      role: dto.role,
    });
    return this.userRepository.create(user);
  }
}
