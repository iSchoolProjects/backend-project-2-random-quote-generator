import { Module } from '@nestjs/common';
import { AdminQuoteService } from './admin-quote.service';
import { AdminQuoteController } from './admin-quote.controller';

@Module({
  providers: [AdminQuoteService],
  controllers: [AdminQuoteController]
})
export class AdminQuoteModule {}
