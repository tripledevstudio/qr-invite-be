import { Controller, Get, Query, UseGuards, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ListRequestsUseCase } from './application/use-cases/list-requests.usecase';
import { ApproveRequestUseCase } from './application/use-cases/approve-request.usecase';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { ListRequestsDto } from './dto/list-requests.dto';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestController {
  constructor(
    private readonly listRequestsUseCase: ListRequestsUseCase,
    private readonly approveRequestUseCase: ApproveRequestUseCase,
  ) { }

  @Post('approve')
  @ApiOperation({ summary: 'Approve or reject a request' })
  async approve(@Body() dto: ApproveRequestDto) {
    return this.approveRequestUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of requests with optional filtering and sorting' })
  async getRequests(@Query() filter: ListRequestsDto) {
    return this.listRequestsUseCase.execute(filter);
  }
}