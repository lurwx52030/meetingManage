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

  @Get(':id')
  async getUser(@Request() req: Request, @Param('id') id: string) {
    let user = await this.userService.getEmployeeById(id);
    if (req.headers['authorization'] !== undefined) {
      const jwtToken = (req.headers['authorization'] as string).replace(
        'Bearer ',
        '',
      );
      const reqUser = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('jwt.secret'),
      });
      // console.log(reqUser['role']);

      if (reqUser['role'] == 'admin' && reqUser['id'] === id) {
        user = await this.userService.getUserById(id);
      }

      if (user instanceof Array && user.length == 1) {
        user = user[0];
        delete user.salt;
        delete user.password;
      }

      if (reqUser['role'] === 'employee') {
        if (reqUser['id'] !== user.id) {
          throw new HttpException(
            '只開放一般員工查詢自己的資料！',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }
    return Result.ok(user, '查詢成功');
  }

  @Put(':id')
  async update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updateMettingRoomDto: UpdateUserDto,
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
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }

    const res = await this.userService.update(id, updateMettingRoomDto);
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
