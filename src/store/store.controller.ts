import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStoreUseCase } from './application/use-cases/create-store.usecase';
import { ListStoresUseCase } from './application/use-cases/list-stores.usecase';
import { GetStoreUseCase } from './application/use-cases/get-store.usecase';
import { UpdateStoreUseCase } from './application/use-cases/update-store.usecase';
import { DeleteStoreUseCase } from './application/use-cases/delete-store.usecase';
import { ListStoreUsersUseCase } from './application/use-cases/list-store-users.usecase';
import { CreateStoreDto } from './dto/create-store.dto';
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

  @Get(':id/users')
  @ApiOperation({ summary: 'Get list of users in store' })
  async findUsers(@Param('id') id: string) {
    return this.listStoreUsersUseCase.execute(id);
  }
}
