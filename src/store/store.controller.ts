import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ForbiddenException } from '@nestjs/common';
import { CreateStoreUseCase } from './application/use-cases/create-store.usecase';
import { ListStoresUseCase } from './application/use-cases/list-stores.usecase';
import { GetStoreUseCase } from './application/use-cases/get-store.usecase';
import { UpdateStoreUseCase } from './application/use-cases/update-store.usecase';
import { DeleteStoreUseCase } from './application/use-cases/delete-store.usecase';
import { ListStoreUsersUseCase } from './application/use-cases/list-store-users.usecase';
import { CreateStoreDto } from './dto/create-store.dto';
import { ListStoreUsersDto } from './dto/list-store-users.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly listStoresUseCase: ListStoresUseCase,
    private readonly getStoreUseCase: GetStoreUseCase,
    private readonly updateStoreUseCase: UpdateStoreUseCase,
    private readonly deleteStoreUseCase: DeleteStoreUseCase,
    private readonly listStoreUsersUseCase: ListStoreUsersUseCase,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() dto: CreateStoreDto, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can create stores');
    const adminId = req.user?.user_id ?? req.user?.sub ?? req.user?.id;
    return this.createStoreUseCase.execute(dto, adminId);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of stores (paginated)' })
  async findAll(@Query() pagination: PaginationDto, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can list stores');
    const adminId = req.user?.user_id ?? req.user?.sub ?? req.user?.id;
    const list = await this.listStoresUseCase.execute(adminId);
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;
    return this.paginationService.paginate(list, page, pageSize);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get list of users in store based on token' })
  async findUsers(@Req() req: any, @Query() query: ListStoreUsersDto) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can view users');
    const storeId = req.user?.store_id;
    if (!storeId) {
      throw new BadRequestException('Store ID is missing in token');
    }
    return this.listStoreUsersUseCase.execute(storeId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can access store');
    return this.getStoreUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can update store');
    const adminId = req.user?.user_id ?? req.user?.sub ?? req.user?.id;
    return this.updateStoreUseCase.execute(id, dto, adminId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store by ID' })
  async remove(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Only ADMIN can delete store');
    return this.deleteStoreUseCase.execute(id);
  }
}
