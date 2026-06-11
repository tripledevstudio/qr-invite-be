import { Controller, Get, Header, Res, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { Response } from 'express';
import { welcomeHtml } from './app.html';

@Controller()
@ApiTags('Health-check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version(VERSION_NEUTRAL)
  @Get()
  @Header('Content-Type', 'text/html')
  getHome(@Res() res: Response) {
    return res.type('text/html').send(welcomeHtml);
  }

  @Get('health')
  @ApiOperation({ summary: 'Check server health' })
  healthCheck() {
    return this.appService.healthCheck();
  }
}
