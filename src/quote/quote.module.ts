import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../entity/quote/quote.entity';
import { HelperService } from '../common/helper.service';
import { PaginationService } from '../common/pagination.service';
import { FilterService } from '../common/filter.service';
import { OrderService } from '../common/order.service';
import { AuthModule } from '../auth/auth.module';
import { SlugModule } from '../slug/slug.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote]), SlugModule, AuthModule],
  providers: [
    QuoteService,
    HelperService,
    FilterService,
    OrderService,
    PaginationService,
  ],
  controllers: [QuoteController],
})
export class QuoteModule {}
