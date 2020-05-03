import { ConfigService } from 'src/common/services/config.service';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import axios from 'axios';

import { SLACK_EVENTS, SLACK_API } from './slack.providers';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  public constructor(
    @Inject(SLACK_API) private readonly slack: WebClient,
    @Inject(SLACK_EVENTS) private readonly slackEvents: any,
    @InjectQueue('nirvana-studio.slack') private readonly slackQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    slackEvents.on('message', this.handleSlackEvent.bind(this, 'message'));
  }

  private handleSlackEvent(type: string, event: any) {
    this.slackQueue.add(type, event);
  }

  public async getUserEmail(user: string) {
    const resp = await this.slack.users.profile.get({
      user,
    });

    return (resp.profile as any).email as string;
  }

  public async handleCommand(data: { channel: string; ts: number; type: string; text: string; user: string }) {
    if (/.(wifi|와이파이)/.test(data.text)) {
      const email = await this.getUserEmail(data.user);
      const username = email.split('@', 1)[0];

      console.info(`${this.configService.envConfig.shhan.radius.host}/users/_`);
      // TODO: refactor
      const resp = await axios.post<{ id: string; password: string }>(`${this.configService.envConfig.shhan.radius.host}/users/_`);

      await this.slack.chat.postMessage({
        channel: data.channel,
        text: `A new WiFi account has been created:\n- Username: \`${resp.data.id}\`\n- Password: \`${resp.data.password}\``,
        mrkdwn: true,
      });
    }
  }
}
