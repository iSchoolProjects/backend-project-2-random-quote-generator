import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entity/user/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
@ApiTags('User endpoints')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiBearerAuth()
  @Put('me')
  @UseGuards(JwtAuthGuard)
  editUser(@Body() editUserDto: EditUserDto, @GetUser() user: User) {
    return this.userService.editUser(editUserDto, user);
  }
}
