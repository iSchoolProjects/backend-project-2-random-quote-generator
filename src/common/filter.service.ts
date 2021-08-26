import { Injectable } from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class FilterService {
  setFilters(filterDto: FilterDto) {
    const filters = {
      where: {},
    };

    if (!filterDto.isDeleted) {
      filterDto.isDeleted = '0';
    }

    filters.where['isDeleted'] = filterDto.isDeleted === '1';
    delete filterDto.isDeleted;

    for (const filter in filterDto) {
      if (filterDto[filter]) {
        filters.where[filter] = filterDto[filter];
      }
    }

    return filters;
  }
}
