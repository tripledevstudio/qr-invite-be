import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  create(@Body() createDto: CreateUserDto) {
    return this.createUserUseCase.execute(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
    return { deleted: true };
  }
}
