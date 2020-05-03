import { SlackConsumer } from './slack.consumer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ConfigService } from './../common/services/config.service';
import { SlackController } from './slack.controller';
import { slackProviders } from './slack.providers';
import { SlackService } from './slack.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'nirvana-studio.slack',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.envConfig.redis,
      }),
    }),
  ],
  providers: [
    ...slackProviders,
    SlackService,
    SlackConsumer,
  ],
  controllers: [
    SlackController,
  ],
  exports: [
    ...slackProviders,
  ],
})
export class SlackModule {
}
