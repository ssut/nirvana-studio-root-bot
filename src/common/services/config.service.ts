import 'dotenv/config';
import { Injectable } from '@nestjs/common';

const { env } = process;

@Injectable()
export class ConfigService {
  public readonly envConfig = {
    slack: Object.freeze({
      token: env.SLACK_TOKEN,
      signingSecret: env.SLACK_SIGNING_SECRET,
    }),

    redis: Object.freeze({
      host: env.REDIS_HOST,
      port: Number(env.REDIS_PORT || 6379),
      password: env.REDIS_PASSWORD,
      db: Number(env.REDIS_DB || 0),
      tls: env.REDIS_TLS_SERVERNAME ? {
        servername: env.REDIS_TLS_SERVERNAME,
      } : undefined,
    }),

    shhan: Object.freeze({
      radius: {
        host: 'https://radius.airfly.io',
      },
    }),
  };
}
