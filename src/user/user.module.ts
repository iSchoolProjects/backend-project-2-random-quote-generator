import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { HelperService } from '../common/helper.service';
import { SlugModule } from '../slug/slug.module';
import { UserPhoto } from '../entity/user-photo/user-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPhoto]), SlugModule],
  controllers: [UserController],
  providers: [UserService, HelperService],
  exports: [UserService],
})
export class UserModule {}
