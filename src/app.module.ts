import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [
    CommonModule,
    SlackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
