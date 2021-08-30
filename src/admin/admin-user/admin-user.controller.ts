import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { User } from '../../entity/user/user.entity';
import { UpdateResult } from 'typeorm';

@Controller('admin/users')
@ApiTags('Admin user endpoints')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.adminUserService.findAllUsers();
  }

  @Get(':id')
  async findUser(@Param('id') id: number): Promise<User> {
    return await this.adminUserService.findUser(id);
  }

  @Put(':id')
  async editUser(@Param('id') id: number): Promise<UpdateResult> {
    return await this.adminUserService.changeRoleToAdmin(id);
  }
}
