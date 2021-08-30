import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entity/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/user/user.repository';
import { UpdateResult } from 'typeorm';
import { UserRole } from '../../enum/user-role.enum';

@Injectable()
export class AdminUserService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUser(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async changeRoleToAdmin(id: number): Promise<UpdateResult> {
    const user: User = await this.findUser(id);
    if (user.role === UserRole.ADMIN) {
      throw new ConflictException('User is already admin.');
    }
    user.role = UserRole.ADMIN;
    return await this.userRepository.update(id, user);
  }
}
