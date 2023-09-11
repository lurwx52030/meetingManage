import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { encryptBySalt } from 'src/common/encryptBySalt';
import { Result } from 'src/common/standardResult';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const existing = await this.getUserById(user.id);
    console.log(existing);
    if (existing instanceof Array && existing.length >= 1) {
      throw new HttpException('此員工已存在', HttpStatus.NOT_ACCEPTABLE);
    }

    //密碼加鹽並hash
    const { hash, salt } = encryptBySalt(user.password);

    const hashUser = plainToClass(User, { ...user, password: hash, salt });
    const newUser = await this.userRepository.save(hashUser);
    return newUser;
  }

  async getUserById(userId: string) {
    const res = await this.userRepository.query(
      'select * from user where id=?',
      [userId],
    );
    return res;
  }

  async getEmployeeById(userId: string) {
    const res = await this.userRepository.query(
      'select * from user where role="employee" and id=?',
      [userId],
    );
    return res;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserByAccount(account: string) {
    const res = await this.userRepository.findOne({
      where: { account: account },
    });
    return res;
  }

  async update(id: string, user: UpdateUserDto) {
    //檢查是否存在此員工
    const existing = await this.getUserById(id);
    if (!existing) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    //密碼加鹽並hash
    const { hash, salt } = encryptBySalt(user.password);

    const res = await this.userRepository.update(id, {
      ...user,
      password: hash,
      salt,
    });
    return res;
  }

  async remove(id: string) {
    return Result.ok(await this.userRepository.delete(id));
  }
}
