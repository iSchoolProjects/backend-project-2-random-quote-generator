import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { HelperService } from '../common/helper.service';
import { SlugService } from '../slug/slug.service';
import { Slug } from '../entity/slug/slug.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Slug])],
  controllers: [UserController],
  providers: [UserService, HelperService, SlugService],
})
export class UserModule {}
