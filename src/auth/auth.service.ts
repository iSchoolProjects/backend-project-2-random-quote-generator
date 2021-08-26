import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../entity/user/user.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  async login(loginCredentialsDto: LoginCredentialsDto): Promise<{
    user: User;
    token: string;
  }> {
    const { usernameOrEmail, password } = loginCredentialsDto;
    const user = await this.userService.findUserByUsernameOrEmail(
      usernameOrEmail,
    );

    await this.checkPassword(password, user);

    const payload = { username: user.username };
    const token: string = this.jwtService.sign(payload);

    return { user, token };
  }

  async checkPassword(password: string, user: User): Promise<void> {
    const passwordHash = await bcrypt.hash(password, user.salt);
    if (passwordHash !== user.password) {
      throw new UnauthorizedException();
    }
  }
}
