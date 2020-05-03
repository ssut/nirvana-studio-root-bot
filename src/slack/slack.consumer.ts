import { SlackService } from './slack.service';
import { ConfigService } from './../common/services/config.service';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

@Processor('nirvana-studio.slack')
export class SlackConsumer {
  private readonly redisClient: redis.RedisClient;
  private readonly rateLimiter: RateLimiterRedis;

  public constructor(
    private readonly configService: ConfigService,
    private readonly slackService: SlackService,
  ) {
    this.redisClient = redis.createClient({
      ...configService.envConfig.redis,
      // eslint-disable-next-line @typescript-eslint/camelcase
      enable_offline_queue: false,
    });
  }

  private createRateLimiter(points: number, duration: number) {
    return new RateLimiterRedis({
      storeClient: this.redisClient,
      points,
      duration,
      keyPrefix: 'slack',
    });
  }

  @Process('message')
  public async message(job: Job<any>) {
    const data = job.data;

    const rateLimiterKey = `message:${data.user}`;
    try {
      await this.createRateLimiter(5, 5).consume(rateLimiterKey);
    } catch {
      return;
    }

    // commands
    if (data.text.startsWith('.')) {
      await this.slackService.handleCommand(data);
    }
  }
}
