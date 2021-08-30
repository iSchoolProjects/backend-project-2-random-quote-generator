import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { AdminCreateQuoteDto } from './admin-create-quote.dto';
import { Type } from 'class-transformer';

export class AdminCreateMultipleQuotesDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminCreateQuoteDto)
  quotes: AdminCreateQuoteDto[];
}
