import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { HelperService } from '../common/helper.service';
import { SlugService } from '../slug/slug.service';
import { Slug } from '../entity/slug/slug.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { PasswordResetCodeRepository } from '../repository/password-reset-code/password-reset-code.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRE),
      },
    }),
    TypeOrmModule.forFeature([User, Slug, PasswordResetCodeRepository]),
    UserModule,
    MailModule,
  ],
  providers: [AuthService, HelperService, SlugService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
