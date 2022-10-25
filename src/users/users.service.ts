import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfirmNicknameDto, ConfirmPhoneNumberDto } from './users.dto';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async confirmNickname({ nickname }: ConfirmNicknameDto) {
    const isUser = await this.usersRepository.findUserByNickname(nickname);

    if (isUser) {
      throw new BadRequestException();
    }
  }

  async confirmPhoneNumber({ phoneNumber }: ConfirmPhoneNumberDto) {
    const isUser = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (isUser) {
      throw new BadRequestException();
    }
  }
}
