import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Public() // مسار عام لأن الـ Load Balancer لا يملك Token
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1. فحص اتصال قاعدة البيانات (هل Mongoose يعمل؟)
      () => this.mongoose.pingCheck('database'),

      // 2. فحص وهمي للذاكرة (اختياري: التأكد من أن السيرفر لا يختنق)
      // () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
