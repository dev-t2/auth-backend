import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async confirmNickname(nickname: string) {
    const isUser = await this.usersRepository.findUserByNickname(nickname);

    if (isUser) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다');
    }
  }
}
