import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './domain/entities/service.entity';
import { CreateServiceUseCase } from './application/use-cases/create-service.usecase';
import { UpdateServiceUseCase } from './application/use-cases/update-service.usecase';
import { GetServiceUseCase } from './application/use-cases/get-service.usecase';
import { ListServicesUseCase } from './application/use-cases/list-services.usecase';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.usecase';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly listServicesUseCase: ListServicesUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateServiceDto): Promise<Service> {
    const storeId = (req as any).user?.store_id;
    return this.createServiceUseCase.execute(dto, storeId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    const storeId = (req as any).user?.store_id;
    return this.updateServiceUseCase.execute(id, dto, storeId);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Service> {
    return this.getServiceUseCase.execute(id);
  }

  @Get()
  async list(@Query() pagination: PaginationDto, @Req() req: any): Promise<any> {
    const storeId = req.user?.store_id;
    const services = await this.listServicesUseCase.execute(storeId);
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;
    return this.paginationService.paginate(services, page, pageSize);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.deleteServiceUseCase.execute(id);
  }
}
