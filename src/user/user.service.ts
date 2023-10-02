import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { encryptBySalt } from 'src/common/encryptBySalt';
import { Result } from 'src/common/standardResult';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    //檢查是否存在此員工
    const existingEmployee = await this.getUserById(user.id);
    if (existingEmployee instanceof Array && existingEmployee.length >= 1) {
      throw new HttpException('此員工已存在', HttpStatus.NOT_ACCEPTABLE);
    }

    //檢查帳號是否被使用
    const existingAccount = await this.getUserByAccount(user.account);
    if (existingAccount instanceof Array && existingAccount.length >= 1) {
      throw new HttpException('此帳號已被使用', HttpStatus.NOT_ACCEPTABLE);
    }

    //密碼加鹽並hash
    const { hash, salt } = encryptBySalt(user.password);

    const hashUser = plainToClass(User, { ...user, password: hash, salt });
    const newUser = await this.userRepository.save(hashUser);
    return newUser;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getAllEmployees() {
    return await this.userRepository.query(
      "SELECT id,name,role FROM `user` WHERE role='employee';",
    );
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
      'select * from user where id=?',
      [userId],
    );
    return res;
  }

  async getUserByAccount(account: string) {
    const res = await this.userRepository.query(
      'select * from user where account=?',
      [account],
    );
    return res;
  }

  async update(id: string, user: UpdateUserDto) {
    //檢查是否存在此員工
    const existingEmployee = await this.getUserById(id);
    if (existingEmployee instanceof Array && existingEmployee.length < 1) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    //檢查帳號是否被使用
    let existingAccount = await this.getUserByAccount(user.account);
    if (existingAccount instanceof Array && existingAccount.length >= 1) {
      existingAccount = existingAccount.filter(
        (User) => User.id !== existingEmployee[0].id,
      );
      if (existingAccount.length >= 1) {
        throw new HttpException('此帳號已被使用', HttpStatus.BAD_REQUEST);
      }
    }

    //密碼加鹽並hash
    // const { hash, salt } = encryptBySalt(user.password);

    const res = await this.userRepository.update(id, {
      ...user,
      // password: hash,
      // salt,
    });
    return res;
  }

  async updateAccount(id: string, acc: UpdateAccountDto) {
    const existingEmployee = await this.getUserById(id);
    if (existingEmployee instanceof Array && existingEmployee.length < 1) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    //檢查帳號是否被使用
    let existingAccount = await this.getUserByAccount(
      existingEmployee[0].account,
    );
    if (existingAccount instanceof Array && existingAccount.length >= 1) {
      existingAccount = existingAccount.filter(
        (User) => User.id !== existingEmployee[0].id,
      );
      if (existingAccount.length >= 1) {
        throw new HttpException('此帳號已被使用', HttpStatus.BAD_REQUEST);
      }
    }

    //密碼加鹽並hash
    const { hash, salt } = encryptBySalt(acc.password);

    const res = await this.userRepository.update(id, {
      account: acc.account,
      password: hash,
      salt,
    });
    return res;
  }

  async remove(id: string) {
    return Result.ok(await this.userRepository.delete(id));
  }
}
