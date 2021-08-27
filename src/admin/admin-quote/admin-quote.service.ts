import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entity/quote/quote.entity';
import { QuoteRepository } from '../../repository/quote/quote.repository';
import { User } from '../../entity/user/user.entity';
import { UserRepository } from '../../repository/user/user.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AdminCreateQuoteDto } from './dto/admin-create-quote.dto';
import { HelperService } from '../../common/helper.service';
import { UserRole } from '../../enum/user-role.enum';
import { AdminEditQuoteDto } from './dto/admin-edit-quote.dto';

@Injectable()
export class AdminQuoteService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: QuoteRepository,
    @InjectRepository(User)
    private userRepository: UserRepository,
    private helperService: HelperService,
  ) {}

  async findAllQuotes(filters, order, pagination): Promise<Quote[]> {
    return await this.quoteRepository.find({
      ...filters,
      ...order,
      ...pagination,
    });
  }

  async findQuotesByUser(userId: number): Promise<Quote[]> {
    try {
      const user: User = await this.userRepository.findOneOrFail(userId, {
        relations: ['quotes'],
      });
      return user.quotes;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async createQuote(adminCreateQuoteDto: AdminCreateQuoteDto): Promise<Quote> {
    if (adminCreateQuoteDto.createdBy) {
      await this.checkIfUserExistsAndIsAdmin(adminCreateQuoteDto.createdBy);
    }

    const quote: Quote = new Quote(adminCreateQuoteDto);
    quote.slug = await this.helperService.generateSlug(quote.title);

    return await this.quoteRepository.save(quote);
  }

  async editQuote(
    id: number,
    adminEditQuoteDto: AdminEditQuoteDto,
  ): Promise<UpdateResult> {
    if (adminEditQuoteDto.createdBy) {
      await this.checkIfUserExistsAndIsAdmin(adminEditQuoteDto.createdBy);
    }

    const quote: Quote = new Quote(adminEditQuoteDto);
    if (quote.title) {
      quote.slug = await this.helperService.generateSlug(quote.title);
    }

    return await this.quoteRepository.update(id, quote);
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

  async checkIfUserExistsAndIsAdmin(user: User) {
    const userCheck: User = await this.userRepository.findOne(user);
    if (!userCheck) {
      throw new NotFoundException();
    } else if (userCheck.role === UserRole.ADMIN) {
      throw new BadRequestException(`Admins can't have posts`);
    }
  }
}
