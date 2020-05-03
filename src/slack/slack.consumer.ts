import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('nirvana-studio.slack')
export class SlackConsumer {
  @Process('message')
  public async message(job: Job<any>) {
    console.info(job.data);
  }
}
