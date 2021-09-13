import { Module } from '@nestjs/common';
import { AdminQuoteService } from './admin-quote.service';
import { AdminQuoteController } from './admin-quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../../entity/quote/quote.entity';
import { FilterService } from '../../common/filter.service';
import { OrderService } from '../../common/order.service';
import { PaginationService } from '../../common/pagination.service';
import { User } from '../../entity/user/user.entity';
import { HelperService } from '../../common/helper.service';
import { SlugModule } from '../../slug/slug.module';
import { ExceptionService } from '../../common/exception.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, User]), SlugModule],
  providers: [
    AdminQuoteService,
    FilterService,
    OrderService,
    PaginationService,
    HelperService,
    ExceptionService,
  ],
  controllers: [AdminQuoteController],
})
export class AdminQuoteModule {}
