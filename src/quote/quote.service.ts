import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quote } from '../entity/quote/quote.entity';
import { QuoteRepository } from '../repository/quote/quote.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { HelperService } from '../common/helper.service';
import { User } from '../entity/user/user.entity';

@Injectable()
export class QuoteService {
  constructor(
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

  async findAllQuotes(
    filters,
    order,
    pagination,
    user: User,
  ): Promise<Quote[]> {
    return await this.quoteRepository.findQuotesForUser(
      filters,
      order,
      pagination,
      user,
    );
  }

  async findOneQuote(id: number, user: User): Promise<Quote> {
    try {
      return await this.checkIfQuoteBelongsToUser(id, user.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async editQuote(
    id: number,
    editQuoteDto: EditQuoteDto,
    user: User,
  ): Promise<UpdateResult> {
    await this.checkIfQuoteBelongsToUser(id, user.id);
    const quote: Quote = new Quote(editQuoteDto);
    if (quote.title) {
      quote.slug = await this.helperService.generateSlug(quote.title);
    }
    return await this.quoteRepository.update(id, quote);
  }

  async disableQuote(
    id: number,
    user: User,
  ): Promise<DeleteResult | UpdateResult> {
    try {
      const quote = await this.checkIfQuoteBelongsToUser(id, user.id);
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

  async checkIfQuoteBelongsToUser(
    quoteId: number,
    userId: number,
  ): Promise<Quote> {
    const quote = await this.quoteRepository.findOneOrFail(quoteId, {
      relations: ['createdBy'],
    });
    if (quote.createdBy.id !== userId) {
      throw new ForbiddenException();
    }
    return quote;
  }
}
