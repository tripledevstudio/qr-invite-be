import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  async create(@Body() dto: CreateStoreDto) {
    return this.createStoreUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of stores (paginated)' })
  async findAll(@Query() pagination: PaginationDto) {
    const list = await this.listStoresUseCase.execute();
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;
    return this.paginationService.paginate(list, page, pageSize);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get list of users in store based on token' })
  async findUsers(@Req() req: any, @Query() query: ListStoreUsersDto) {
    const storeId = req.user?.store_id;
    if (!storeId) {
      throw new BadRequestException('Store ID is missing in token');
    }
    return this.listStoreUsersUseCase.execute(storeId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  async findOne(@Param('id') id: string) {
    return this.getStoreUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.updateStoreUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store by ID' })
  async remove(@Param('id') id: string) {
    return this.deleteStoreUseCase.execute(id);
  }
}
