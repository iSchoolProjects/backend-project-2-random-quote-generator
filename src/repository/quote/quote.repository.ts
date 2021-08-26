import { EntityRepository, Repository } from 'typeorm';
import { Quote } from '../../entity/quote/quote.entity';

@EntityRepository(Quote)
export class QuoteRepository extends Repository<Quote> {}
