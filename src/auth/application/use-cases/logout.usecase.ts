import { Injectable } from '@nestjs/common';

@Injectable()
export class LogoutUseCase {
  async execute() {
    return { message: 'Logged out successfully' };
  }
}
