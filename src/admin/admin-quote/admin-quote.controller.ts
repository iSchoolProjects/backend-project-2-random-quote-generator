import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminQuoteService } from './admin-quote.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Quote } from '../../entity/quote/quote.entity';
import { FilterDto } from '../../common/dto/filter.dto';
import { OrderDto } from '../../common/dto/order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FilterService } from '../../common/filter.service';
import { OrderService } from '../../common/order.service';
import { PaginationService } from '../../common/pagination.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AdminCreateQuoteDto } from './dto/admin-create-quote.dto';
import { AdminEditQuoteDto } from './dto/admin-edit-quote.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { AdminCreateMultipleQuotesDto } from './dto/admin-create-multiple-quotes.dto';
import { AdminEditMultipleQuotesDto } from './dto/admin-edit-multiple-quotes.dto';

@ApiBearerAuth()
@ApiTags('Admin quote endpoints')
@Controller('admin/quotes')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminQuoteController {
  constructor(
    private readonly adminQuoteService: AdminQuoteService,
    private readonly filterService: FilterService,
    private readonly orderService: OrderService,
    private readonly paginationService: PaginationService,
  ) {}

  @Get()
  async findAllQuotes(
    @Query() filterDto: FilterDto,
    @Query() orderDto: OrderDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Quote[]; pagination: { page: number; perPage: number } }> {
    const filters = this.filterService.setFilters(filterDto);
    const order = this.orderService.setOrder(orderDto);
    const pagination = this.paginationService.setPagination(paginationDto);

    const quotes = await this.adminQuoteService.findAllQuotes(
      filters,
      order,
      pagination,
    );

    return {
      data: quotes,
      pagination: {
        page: paginationDto.page || Number(process.env.DEFAULT_PAGE),
        perPage: pagination.take,
      },
    };
  }

  @Get('pending')
  async findPendingQuotes(): Promise<Quote[]> {
    return await this.adminQuoteService.findPendingQuotes();
  }

  @Get(':id')
  async findQuote(@Param('id') id: number): Promise<Quote> {
    return await this.adminQuoteService.findQuote(id);
  }

  @Get('user/:id')
  async findQuotesByUser(@Param('id') id: number): Promise<Quote[]> {
    return await this.adminQuoteService.findQuotesByUser(id);
  }

  @Post()
  async createQuote(
    @Body() adminCreateQuoteDto: AdminCreateQuoteDto,
  ): Promise<Quote> {
    return await this.adminQuoteService.createQuote(adminCreateQuoteDto);
  }

  @Post('multiple')
  async createMultipleQuotes(
    @Body() adminCreateMultipleQuotesDto: AdminCreateMultipleQuotesDto,
  ): Promise<Quote[]> {
    return await this.adminQuoteService.createMultipleQuotes(
      adminCreateMultipleQuotesDto,
    );
  }

  @Put('multiple')
  async editMultipleQuotes(
    @Body() adminEditMultipleQuotesDto: AdminEditMultipleQuotesDto,
  ): Promise<void> {
    return await this.adminQuoteService.editMultipleQuotes(
      adminEditMultipleQuotesDto,
    );
  }

  @Put(':id')
  async editQuote(
    @Param('id') id: number,
    @Body() adminEditQuoteDto: AdminEditQuoteDto,
  ): Promise<UpdateResult | DeleteResult> {
    return await this.adminQuoteService.editQuote(id, adminEditQuoteDto);
  }

  @Delete('multiple')
  async disableMultipleQuotes(@Body() ids: number[]): Promise<void> {
    return await this.adminQuoteService.disableMultipleQuotes(ids);
  }

  @Delete(':id')
  async disableQuote(
    @Param('id') id: number,
  ): Promise<DeleteResult | UpdateResult> {
    return await this.adminQuoteService.disableQuote(id);
  }
}
