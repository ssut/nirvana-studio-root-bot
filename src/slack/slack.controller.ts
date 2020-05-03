import { Controller, Post, Inject, Req, Res, Next, All, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from 'src/common/services/config.service';
import Phelia from 'phelia';
import { PHELIA, SLACK_EVENTS } from './slack.providers';
import { Request, Response } from 'express';
import { RequestListener } from 'http';

@Controller('slack')
export class SlackController implements OnApplicationBootstrap {
  private pheliaMessageHandler!: RequestListener;
  private eventHandler!: RequestListener;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(PHELIA) private readonly phelia: Phelia,
    @Inject(SLACK_EVENTS) private readonly slackEvents: any,
  ) { }

  public onApplicationBootstrap() {
    this.pheliaMessageHandler = this.phelia.messageHandler(this.configService.envConfig.slack.signingSecret);
    this.eventHandler = this.slackEvents.requestListener();
  }

  @Post('interactions')
  public interactions(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.pheliaMessageHandler?.(req, res);
  }


  @All('events')
  public events(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.eventHandler?.(req, res);
  }
}
