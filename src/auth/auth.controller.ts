import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../entity/user/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@ApiTags('Auth endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginCredentialsDto: LoginCredentialsDto): Promise<{
    user: User;
    token: string;
  }> {
    return await this.authService.login(loginCredentialsDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return await this.authService.changePassword(changePasswordDto);
  }
}
