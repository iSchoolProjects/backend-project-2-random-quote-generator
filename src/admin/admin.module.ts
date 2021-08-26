import { Module } from '@nestjs/common';
import { AdminQuoteModule } from './admin-quote/admin-quote.module';

@Module({
  imports: [AdminQuoteModule],
})
export class AdminModule {}
