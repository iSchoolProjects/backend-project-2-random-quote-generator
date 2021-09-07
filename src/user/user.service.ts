import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user/user.entity';
import { UserRepository } from '../repository/user/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { HelperService } from '../common/helper.service';
import { EditUserDto } from './dto/edit-user.dto';
import { UpdateResult } from 'typeorm';
import { UserPhoto } from '../entity/user-photo/user-photo.entity';
import { UserPhotoRepository } from '../repository/user-photo/user-photo.repository';
import { SetProfilePhotoDto } from './dto/set-profile-photo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    @InjectRepository(UserPhoto)
    private userPhotoRepository: UserPhotoRepository,
    private readonly helperService: HelperService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { hash, salt } = await this.helperService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = hash;
    const user: User = new User(createUserDto);
    user.salt = salt;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException();
    }
  }

  async editUser(editUserDto: EditUserDto, user: User): Promise<UpdateResult> {
    const { hash, salt } = await this.helperService.hashPassword(
      editUserDto.password,
    );
    user.password = hash;
    user.salt = salt;

    return await this.userRepository.update(user.id, user);
  }

  async uploadPhotos(
    photos: Array<Express.Multer.File>,
    user: User,
  ): Promise<void> {
    try {
      for (const photo of photos) {
        const userPhoto: UserPhoto = new UserPhoto({
          photo: photo.filename,
          user: user,
        });
        await this.userPhotoRepository.save(userPhoto);
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async setProfilePhoto(
    setProfilePhotoDto: SetProfilePhotoDto,
    user: User,
  ): Promise<void> {
    const photo: UserPhoto = await this.getPhoto(setProfilePhotoDto.id, user);
    try {
      await this.userRepository.update(user.id, { profilePhoto: photo });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getPhotoLink(id: number, user: User): Promise<{ photo: string }> {
    const photo: UserPhoto = await this.getPhoto(id, user);
    return {
      photo: `${process.env.BASE_URL}${process.env.USER_PHOTOS_DEST}/${user.id}/${photo.photo}`,
    };
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getPhoto(photoId: number, user: User): Promise<UserPhoto> {
    try {
      return await this.userPhotoRepository.findOneOrFail({
        where: {
          id: photoId,
          user: user,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
