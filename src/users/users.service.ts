import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { AuthService } from 'src/auth/auth.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto, FindEmailDto, SignInDto, UpdatePasswordDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
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

  async createAuthNumber(phoneNumber: string) {
    return await this.authService.sendAuthNumberMessage(phoneNumber);
  }

  async confirmAuthNumber(phoneNumber: string, authNumber: string) {
    return { phoneNumber, authNumber };
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
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    return { email: user.email };
  }

  async updatePassword({ phoneNumber, password }: UpdatePasswordDto) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.updatePassword(hashedPassword, phoneNumber);
  }

  async signIn(signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  async createAccessToken(id: number) {
    return await this.authService.createAccessToken(id);
  }

  async updateDeletedAt(id: number) {
    return await this.usersRepository.updateDeletedAt(id);
  }
}
