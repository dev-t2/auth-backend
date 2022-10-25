import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { SignUpDto } from './users.dto';

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

  async signUp({
    email,
    nickname,
    phoneNumber,
    password,
    isServiceTerms,
    isPrivacyTerms,
    isMarketingTerms,
  }: SignUpDto) {
    await Promise.all([
      this.confirmEmail(email),
      this.confirmNickname(nickname),
      this.confirmPhoneNumber(phoneNumber),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.createUser({
      email,
      nickname,
      phoneNumber,
      password: hashedPassword,
      isServiceTerms,
      isPrivacyTerms,
      isMarketingTerms,
    });
  }
}
