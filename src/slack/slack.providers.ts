import { ConfigService } from './../common/services/config.service';
import { createEventAdapter } from '@slack/events-api';
import { Provider } from '@nestjs/common';
import Phelia from 'phelia';

export const PHELIA = Symbol.for('PHELIA');
export const SLACK_EVENTS = Symbol.for('SLACK_EVENTS');

export const slackProviders: Provider[] = [
  {
    provide: PHELIA,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return new Phelia(config.envConfig.slack.token);
    },
  },
  {
    provide: SLACK_EVENTS,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return createEventAdapter(config.envConfig.slack.signingSecret);
    },
  },
];
