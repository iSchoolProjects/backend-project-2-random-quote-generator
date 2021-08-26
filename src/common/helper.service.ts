import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SlugService } from '../slug/slug.service';
import { Slug } from '../entity/slug/slug.entity';

@Injectable()
export class HelperService {
  constructor(private readonly slugService: SlugService) {}

  async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);
    return {
      hash,
      salt,
    };
  }

  async generateSlug(title: string): Promise<string> {
    let slug: string = title.trim().toLocaleLowerCase();
    slug = slug.replace(/ /g, '-');

    const existingSlug: Slug = await this.slugService.getExistingSlug(slug);

    if (!existingSlug) {
      await this.slugService.createSlug(slug);

      return slug;
    }

    existingSlug.count++;
    await this.slugService.updateSlugCount(existingSlug.id, existingSlug);
    const thisSlugNumber = existingSlug.count - 1;
    slug += `-${thisSlugNumber.toString()}`;

    return slug;
  }
}
