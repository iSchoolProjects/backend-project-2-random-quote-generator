import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Quote } from '../../entity/quote/quote.entity';
import { User } from '../../entity/user/user.entity';

@EntityRepository(Quote)
export class QuoteRepository extends Repository<Quote> {
  async findQuotesForUser(
    filters,
    order,
    pagination,
    user: User,
  ): Promise<Quote[]> {
    let qb = await this.createQueryBuilder('quote')
      .leftJoinAndSelect('quote.createdBy', 'user')
      .orderBy(`quote.${order.orderBy}`, order.orderType)
      .where('quote.isDeleted = :isDeleted', { isDeleted: filters.isDeleted });

    delete filters.isDeleted;

    for (const filter in filters) {
      qb = qb.andWhere(`quote.${filter} = :${filter}`, {
        [filter]: filters[filter],
      });
    }

    qb = qb.andWhere(
      new Brackets((qb1) => {
        qb1
          .where('quote.createdBy = :id', { id: user.id })
          .orWhere('quote.createdBy IS NULL');
      }),
    );

    return qb.skip(pagination.skip).take(pagination.take).getMany();
  }
}
