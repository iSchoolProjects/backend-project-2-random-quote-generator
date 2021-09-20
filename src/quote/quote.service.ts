import { Injectable } from '@nestjs/common';
import { Quote } from '../entity/quote/quote.entity';
import { QuoteRepository } from '../repository/quote/quote.repository';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditQuoteDto } from './dto/edit-quote.dto';
import { HelperService } from '../common/helper.service';
import { User } from '../entity/user/user.entity';
import { ExceptionService } from '../common/exception.service';
import { QuoteStatus } from '../enum/quote-status.enum';

@Injectable()
export class QuoteService {
  constructor(
    private quoteRepository: QuoteRepository,
    private helperService: HelperService,
    private exceptionService: ExceptionService,
  ) {}

  async createQuote(
    createQuoteDto: CreateQuoteDto,
    user: User,
  ): Promise<Quote> {
    const quote: Quote = new Quote(createQuoteDto);
    quote.slug = await this.helperService.generateSlug(quote.title);

    return await this.quoteRepository.save({
      ...quote,
      createdBy: user,
      status: QuoteStatus.PENDING,
    });
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
    return await this.checkIfQuoteBelongsToUser(id, user);
  }

  async editQuote(
    id: number,
    editQuoteDto: EditQuoteDto,
    user: User,
  ): Promise<UpdateResult> {
    await this.checkIfQuoteBelongsToUser(id, user);
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
    const quote = await this.checkIfQuoteBelongsToUser(id, user);
    if (quote.isDeleted) {
      return await this.quoteRepository.delete(id);
    } else {
      return await this.quoteRepository.update(id, {
        isDeleted: true,
      });
    }
  }

  async checkIfQuoteBelongsToUser(quoteId: number, user: User): Promise<Quote> {
    try {
      return await this.quoteRepository.findOneOrFail({
        where: { id: quoteId, createdBy: user, status: QuoteStatus.APPROVED },
      });
    } catch (error) {
      this.exceptionService.throwException(error);
    }
  }
}
