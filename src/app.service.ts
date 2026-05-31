import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'ok',
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuCount: os.cpus().length,
      networkInterfaces: os.networkInterfaces(),
      timestamp: new Date().toISOString(),
    };
  }
}
