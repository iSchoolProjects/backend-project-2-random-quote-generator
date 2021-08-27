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

@ApiBearerAuth()
@ApiTags('Admin quot endpoints')
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

  @Get(':id')
  async findQuotesByUser(@Param('id') id: number): Promise<Quote[]> {
    return await this.adminQuoteService.findQuotesByUser(id);
  }

  @Post()
  async createQuote(
    @Body() adminCreateQuoteDto: AdminCreateQuoteDto,
  ): Promise<Quote> {
    return await this.adminQuoteService.createQuote(adminCreateQuoteDto);
  }

  @Put(':id')
  async editQuote(
    @Param('id') id: number,
    @Body() adminEditQuoteDto: AdminEditQuoteDto,
  ): Promise<UpdateResult> {
    return await this.adminQuoteService.editQuote(id, adminEditQuoteDto);
  }

  @Delete(':id')
  async disableQuote(
    @Param('id') id: number,
  ): Promise<DeleteResult | UpdateResult> {
    return await this.adminQuoteService.disableQuote(id);
  }
}
