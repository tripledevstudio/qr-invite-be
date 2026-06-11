import { Controller, Post, Body, UseGuards, Get, Param, Req, Put } from '@nestjs/common';
import { SwitchStoreUseCase } from './application/use-cases/switch-store.usecase';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SwitchStoreDto } from './dto/switch-store.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdminUseCase, UpdateAdminUseCase, LoginAdminUseCase, GetAdminByIdUseCase } from './application/use-cases';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
    private readonly getAdminByIdUseCase: GetAdminByIdUseCase,
    private readonly switchStoreUseCase: SwitchStoreUseCase,
    private readonly updateAdminUseCase: UpdateAdminUseCase
  ) { }

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

  @Post('switch-store')
  // Existing switchStore endpoint unchanged
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Switch current store for admin' })
  async switchStore(@Body() dto: SwitchStoreDto, @Req() req: any) {
    const adminId = req.user?.user_id ?? req.user?.sub ?? req.user?.id;
    return this.switchStoreUseCase.execute(adminId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update admin information' })
  @ApiResponse({ status: 200, description: 'Admin updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.updateAdminUseCase.execute(id, dto);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return this.getAdminByIdUseCase.execute(id);
  }
}
