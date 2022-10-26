import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { CreateUserDto, FindEmailDto, PasswordResetDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async confirmEmail(email: string) {
    const isUser = await this.usersRepository.findUserByEmail(email);

    if (isUser) {
      throw new BadRequestException();
    }
  }

  async confirmNickname(nickname: string) {
    const isUser = await this.usersRepository.findUserByNickname(nickname);

    if (isUser) {
      throw new BadRequestException();
    }
  }

  async confirmPhoneNumber(phoneNumber: string) {
    const isUser = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (isUser) {
      throw new BadRequestException();
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
    if (!isServiceTerms || !isPrivacyTerms) {
      throw new BadRequestException();
    }

    await Promise.all([
      this.confirmEmail(email),
      this.confirmNickname(nickname),
      this.confirmPhoneNumber(phoneNumber),
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

    if (!user) {
      throw new BadRequestException();
    }

    return { email: user.email };
  }

  async passwordReset({ password, phoneNumber }: PasswordResetDto) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.updateUserPassword(hashedPassword, phoneNumber);
  }
}
