import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { SLACK_EVENTS } from './slack.providers';

@Injectable()
export class SlackService {
  public constructor(
    @Inject(SLACK_EVENTS) private readonly slackEvents: any,
    @InjectQueue('nirvana-studio.slack') private readonly slackQueue: Queue,
  ) {
    slackEvents.on('message', this.handleSlackEvent.bind(this, 'message'));
  }

  private handleSlackEvent(type: string, event: any) {
    this.slackQueue.add(type, event);
  }
}
