import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { ConfirmNicknameDto, ConfirmPhoneNumberDto, SignUpDto } from './users.dto';

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

  async signUp(signUpDto: SignUpDto) {
    return await this.usersRepository.createUser(signUpDto);
  }
}
