import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFiles,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from './dto/files-upload.dto';
import getMulterConfig from '../config/multer.config';

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

  @Post('photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, getMulterConfig('user-photos')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilesUploadDto })
  async uploadPhotos(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @GetUser() user: User,
  ) {
    return await this.userService.uploadPhotos(photos, user);
  }
}
