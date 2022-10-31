import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly usersRepository: UsersRepository,
  ) {}

  async deleteUser(id: number, deletedAt: Date) {
    const timeInterval = new Date().getTime() - deletedAt.getTime();
    const isDelete = Math.floor(timeInterval / (24 * 60 * 60 * 1000)) >= 7;

    console.log(Math.floor(timeInterval / (24 * 60 * 60 * 1000)));

    if (isDelete) {
      await this.usersRepository.deleteUser(id);
    } else {
      throw new BadRequestException();
    }
  }

  async duplicateEmail(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }
  }

  async duplicateNickname(nickname: string) {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }
  }

  async duplicatePhone(phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }
  }

  async createUser({
    email,
    nickname,
    password,
    phoneNumber,
    isServiceTerms,
    isPrivacyTerms,
    isMarketingTerms,
  }: CreateUserDto) {
    const isCached = await this.cache.get<string>(phoneNumber);

    if (!isCached) {
      throw new UnauthorizedException();
    }

    await this.cache.del(phoneNumber);

    if (!isServiceTerms || !isPrivacyTerms) {
      throw new BadRequestException();
    }

    await Promise.all([
      this.duplicateEmail(email),
      this.duplicateNickname(nickname),
      this.duplicatePhone(phoneNumber),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
      phoneNumber,
      isServiceTerms,
      isPrivacyTerms,
      isMarketingTerms,
    });
  }

  async findPhone(phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }
  }

  async findEmail(phoneNumber: string) {
    const isCached = await this.cache.get<string>(phoneNumber);

    if (!isCached) {
      throw new UnauthorizedException();
    }

    await this.cache.del(phoneNumber);

    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    return { email: user.email };
  }

  async updatePassword(phoneNumber: string, password: string) {
    const isCached = await this.cache.get<string>(phoneNumber);

    if (!isCached) {
      throw new UnauthorizedException();
    }

    await this.cache.del(phoneNumber);

    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.updatePassword(hashedPassword, phoneNumber);
  }

  async updateDeletedAt(id: number) {
    return await this.usersRepository.updateDeletedAt(id);
  }
}
