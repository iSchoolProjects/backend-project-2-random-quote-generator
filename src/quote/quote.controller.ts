import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from '../entity/quote/quote.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationService } from '../common/pagination.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilterDto } from '../common/dto/filter.dto';
import { FilterService } from '../common/filter.service';
import { OrderDto } from '../common/dto/order.dto';
import { OrderService } from '../common/order.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entity/user/user.entity';

@Controller('quotes')
@ApiTags('Quote endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly filterService: FilterService,
    private readonly orderService: OrderService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  createQuote(
    @Body() createQuoteDto: CreateQuoteDto,
    @GetUser() user: User,
  ): Promise<Quote> {
    return this.quoteService.createQuote(createQuoteDto, user);
  }

  @Get()
  async findAllQuotes(
    @Query() filterDto: FilterDto,
    @Query() orderDto: OrderDto,
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ): Promise<{ data: Quote[]; pagination: { page: number; perPage: number } }> {
    const filters = this.filterService.setFilters(filterDto);
    const order = this.orderService.setOrder(orderDto);
    const pagination = this.paginationService.setPagination(paginationDto);

    const quotes = await this.quoteService.findAllQuotes(
      filters,
      order,
      pagination,
      user,
    );

    return {
      data: quotes,
      pagination: {
        page: paginationDto.page || Number(process.env.DEFAULT_PAGE),
        perPage: pagination.take,
      },
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOneQuote(@Param('id') id: number, @GetUser() user: User): Promise<Quote> {
    return this.quoteService.findOneQuote(id, user);
  }

  @Put(':id')
  editQuote(
    @Param('id') id: number,
    @Body() editQuoteDto: EditQuoteDto,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return this.quoteService.editQuote(id, editQuoteDto, user);
  }

  @Delete(':id')
  disableQuote(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<DeleteResult | Quote> {
    return this.quoteService.disableQuote(id, user);
  }
}
