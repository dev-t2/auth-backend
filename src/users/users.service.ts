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
import { CreateUserDto, FindEmailDto, UpdatePasswordDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly usersRepository: UsersRepository,
  ) {}

  async deleteUser(id: number, deletedAt: Date) {
    const currentTime = new Date().getTime();
    const deletedTime = deletedAt.getTime();

    const isDelete = Math.floor((currentTime - deletedTime) / (1000 * 60 * 60 * 24)) >= 7;

    if (isDelete) {
      await this.usersRepository.deleteUser(id);
    } else {
      throw new BadRequestException();
    }
  }

  async confirmEmail(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }
  }

  async confirmNickname(nickname: string) {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }
  }

  async confirmPhoneNumber(isDup: boolean, phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (isDup && user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);
      } else {
        throw new BadRequestException();
      }
    }

    if (!isDup && user) {
      if (user.deletedAt) {
        await this.deleteUser(user.id, user.deletedAt);

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
    const type = await this.cache.get<string>(phoneNumber);

    if (type !== 'sign') {
      throw new UnauthorizedException();
    }

    await this.cache.del(phoneNumber);

    if (!isServiceTerms || !isPrivacyTerms) {
      throw new BadRequestException();
    }

    await Promise.all([
      this.confirmEmail(email),
      this.confirmNickname(nickname),
      this.confirmPhoneNumber(true, phoneNumber),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser(
      email,
      nickname,
      hashedPassword,
      phoneNumber,
      isServiceTerms,
      isPrivacyTerms,
      isMarketingTerms,
    );
  }

  async findEmail({ phoneNumber }: FindEmailDto) {
    const type = await this.cache.get<string>(phoneNumber);

    if (type !== 'email') {
      throw new UnauthorizedException();
    }

    await this.cache.del(phoneNumber);

    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    return { email: user.email };
  }

  async updatePassword({ phoneNumber, password }: UpdatePasswordDto) {
    const type = await this.cache.get<string>(phoneNumber);

    if (type !== 'password') {
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
