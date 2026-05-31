import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckInUseCase } from './application/use-cases/check-in.usecase';
import { GetLogsUseCase } from './application/use-cases/get-logs.usecase';
import { CheckInDto } from './dto/check-in.dto';
import { CheckInFilterDto } from './dto/check-in-filter.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';

@ApiTags('Check-ins')
@ApiBearerAuth()
@Controller('checkins')
export class CheckInController {
  constructor(
    private readonly checkInUseCase: CheckInUseCase,
    private readonly getLogsUseCase: GetLogsUseCase,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Record a user check-in at a store' })
  async checkIn(@Body() payload: CheckInDto) {
    return this.checkInUseCase.execute(payload);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get check-in logs with time/store filters and pagination' })
  async getLogs(
    @Query() filter: CheckInFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    // Fetch logs based on filters
    const logs = await this.getLogsUseCase.execute(filter);
    
    // Parse pagination parameters (fallback if global transform is disabled)
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;

    // Apply pagination utility
    return this.paginationService.paginate(logs, page, pageSize);
  }
}