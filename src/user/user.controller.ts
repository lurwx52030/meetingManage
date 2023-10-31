import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'src/common/standardResult';
import { RoleGuard } from 'src/role/role.guard';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getUsers() {
    let users = await this.userService.getAllUsers();
    users = users.map((data) => {
      delete data.salt;
      delete data.password;
      return data;
    });
    return Result.ok(users, '查詢成功');
  }

  @Get('employee')
  async getEmployees() {
    const employee = await this.userService.getAllEmployees();
    return Result.ok(employee, '查詢成功');
  }

  @Get(':id')
  async getUser(@Request() req: Request, @Param('id') id: string) {
    let result = await this.userService.getEmployeeById(id);
    if (result instanceof Array && result.length == 1) {
      result = result[0];
      delete result.salt;
      delete result.password;
    }

    if (req.headers['authorization'] !== undefined) {
      const jwtToken = (req.headers['authorization'] as string).replace(
        'Bearer ',
        '',
      );
      const reqUser = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('jwt.secret'),
      });

      if (reqUser['role'] == 'admin' && reqUser['id'] === id) {
        result = await this.userService.getUserById(id);
        result = result.map((data) => {
          delete data.salt;
          delete data.password;
          return data;
        });
      }
      console.log(result);

      if (reqUser['role'] === 'employee') {
        if (reqUser['id'] !== result.id) {
          throw new HttpException(
            '只開放一般員工查詢自己的資料！',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }
    return Result.ok(result, '查詢成功');
  }

  @Put(':id')
  async update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.headers['authorization'] !== undefined) {
      const jwtToken = (req.headers['authorization'] as string).replace(
        'Bearer ',
        '',
      );
      const reqUser = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('jwt.secret'),
      });

      if (reqUser['role'] === 'employee') {
        if (reqUser['id'] !== id) {
          throw new HttpException(
            '無權修改別人的資料!',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    const res = await this.userService.update(id, updateUserDto);
    if (res.affected > 0) {
      return Result.ok(null, '修改成功');
    } else {
      return Result.fail(204, '修改失敗');
    }
  }

  @Put('account/:id')
  async updatePassword(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdateAccountDto,
  ) {
    if (req.headers['authorization'] !== undefined) {
      const jwtToken = (req.headers['authorization'] as string).replace(
        'Bearer ',
        '',
      );
      const reqUser = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('jwt.secret'),
      });

      if (reqUser['role'] === 'employee') {
        if (reqUser['id'] !== id) {
          throw new HttpException(
            '無權修改別人的帳號密碼!',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }

    const res = await this.userService.updateAccount(id, updatePasswordDto);
    if (res.affected > 0) {
      return Result.ok(null, '修改成功');
    } else {
      return Result.fail(204, '修改失敗');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
