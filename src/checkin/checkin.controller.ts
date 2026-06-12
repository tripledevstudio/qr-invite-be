import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { CheckInUseCase } from './application/use-cases/check-in.usecase';
import { ProcessCheckInUseCase } from './application/use-cases/process-check-in.usecase';
import { ProcessCheckInDto } from './dto/process-checkin.dto';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { GetLogsUseCase } from './application/use-cases/get-logs.usecase';
import { GetPointHistoriesUseCase } from './application/use-cases/get-point-histories.usecase';
// import { CheckInDto } from './dto/check-in.dto';
import { CheckInFilterDto } from './dto/check-in-filter.dto';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { PaginationService } from '../common/pagination/pagination.service';

@ApiTags('Check-ins')
@ApiBearerAuth()
@Controller('checkins')
export class CheckInController {
  constructor(
    // private readonly checkInUseCase: CheckInUseCase,
    private readonly processCheckInUseCase: ProcessCheckInUseCase,
    private readonly getPointHistoriesUseCase: GetPointHistoriesUseCase,
    private readonly getLogsUseCase: GetLogsUseCase,
    private readonly paginationService: PaginationService,
  ) {}

  // @Post()
  // @ApiOperation({ summary: 'Record a user check-in at a store' })
  // async checkIn(@Body() payload: CheckInDto) {
  //   return this.checkInUseCase.execute(payload);
  // }

  @Post('process')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Process a check-in with invite code and order amount' })
  async processCheckIn(@Req() req: any, @Body() payload: ProcessCheckInDto) {
    const storeId = req.user?.store_id;
    if (!storeId) {
      throw new BadRequestException('Store ID missing in token');
    }
    return this.processCheckInUseCase.execute(storeId, payload);
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get check-in logs for authenticated user with optional time filters and pagination',
  })
  async getLogs(
    @Req() req: any,
    @Query() filter: CheckInFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    const userId = req.user?.user_id;
    const storeId = req.user?.store_id;

    if (!userId) {
      throw new BadRequestException('User ID missing in token');
    }
    if (!storeId) {
      throw new BadRequestException('Store ID missing in token');
    }

    // Override filter values with token info
    const finalFilter = {
      ...filter,
      user_id: userId,
      store_id: storeId,
    } as any;

    const logs = await this.getLogsUseCase.execute(finalFilter);
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;
    return this.paginationService.paginate(logs, page, pageSize);
  }

  @Get('points')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get point history for the authenticated user in the current store' })
  async getPointHistory(@Req() req: any, @Query() pagination: PaginationDto) {
    const storeId = req.user?.store_id;
    const userId = req.user?.user_id;
    if (!storeId) {
      throw new BadRequestException('Store ID missing in token');
    }
    if (!userId) {
      throw new BadRequestException('User ID missing in token');
    }
    const histories = await this.getPointHistoriesUseCase.execute(userId, storeId);
    const page = pagination.page ? Number(pagination.page) : 1;
    const pageSize = pagination.page_size ? Number(pagination.page_size) : 10;
    return this.paginationService.paginate(histories, page, pageSize);
  }
}
