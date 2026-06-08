import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminUseCase } from './application/use-cases/create-admin.usecase';
import { LoginAdminUseCase } from './application/use-cases/login-admin.usecase';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { GetAdminByIdUseCase } from './application/use-cases/get-admin-by-id.usecase';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
    private readonly getAdminByIdUseCase: GetAdminByIdUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created' })
  async register(@Body() dto: CreateAdminDto) {
    return this.createAdminUseCase.execute(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login admin' })
  @ApiResponse({ status: 200, description: 'JWT token' })
  async login(@Body() dto: LoginAdminDto) {
    return this.loginAdminUseCase.execute(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return this.getAdminByIdUseCase.execute(id);
  }
}