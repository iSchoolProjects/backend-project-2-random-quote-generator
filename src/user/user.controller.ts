import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import multerConfig from '../config/multer.config';

@Controller('users')
@ApiTags('User endpoints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Put('me')
  editUser(
    @Body() editUserDto: EditUserDto,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return this.userService.editUser(editUserDto, user);
  }

  @Post('photo')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadPhoto(
    @UploadedFile() photo: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.userService.uploadPhoto(photo, user);
  }
}
