import { ConfigService } from './services/config.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    ConfigService,
  ],
})
export class CommonModule { }
