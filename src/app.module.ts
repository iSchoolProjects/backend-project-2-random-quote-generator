import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { QuoteModule } from './quote/quote.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SlugModule } from './slug/slug.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    CategoryModule,
    QuoteModule,
    UserModule,
    AuthModule,
    AdminModule,
    SlugModule,
  ],
})
export class AppModule {}
