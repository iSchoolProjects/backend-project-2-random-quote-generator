import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { HelperService } from '../common/helper.service';
import { SlugService } from '../slug/slug.service';
import { Slug } from '../entity/slug/slug.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User, Slug]),
  ],
  providers: [
    AuthService,
    UserService,
    HelperService,
    SlugService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
