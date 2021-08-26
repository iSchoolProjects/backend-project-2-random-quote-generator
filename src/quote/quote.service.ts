import { Injectable, NotFoundException } from '@nestjs/common';
import { Quote } from '../entity/quote/quote.entity';
import { QuoteRepository } from '../repository/quote/quote.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { HelperService } from '../common/helper.service';
import { User } from '../entity/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: QuoteRepository,
    private helperService: HelperService,
  ) {}

  async createQuote(
    createQuoteDto: CreateQuoteDto,
    user: User,
  ): Promise<Quote> {
    const quote: Quote = new Quote(createQuoteDto);
    quote.createdBy = user;
    quote.slug = await this.helperService.generateSlug(quote.title);

    return await this.quoteRepository.save(quote);
  }

  async findAllQuotes(filters, order, pagination): Promise<Quote[]> {
    return await this.quoteRepository.find({
      ...filters,
      ...order,
      ...pagination,
    });
  }

  async findOneQuote(id: number): Promise<Quote> {
    try {
      return await this.quoteRepository.findOneOrFail(id, {
        relations: ['category', 'createdBy'],
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async editQuote(
    id: number,
    editQuoteDto: EditQuoteDto,
  ): Promise<UpdateResult> {
    return await this.quoteRepository.update(id, editQuoteDto);
  }

  async disableQuote(id: number): Promise<DeleteResult | UpdateResult> {
    try {
      const quote = await this.quoteRepository.findOneOrFail(id);
      if (quote.isDeleted) {
        return await this.quoteRepository.delete(id);
      } else {
        quote.isDeleted = true;
        return await this.quoteRepository.update(id, quote);
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
