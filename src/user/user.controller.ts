import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'src/common/standardResult';
import { RoleGuard } from 'src/role/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    const user = await this.userService.getAllUsers();
    user.data = user.data.map((data) => {
      delete data.salt;
      delete data.password;
      return data;
    });
    return Result.ok(user.data, '查詢成功');
  }

  @Get(':id')
  //TODO: 依據權限來給資料，admin可以取得任意employee，employee只能拿自己的
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    user.data = user.data.map((data) => {
      delete data.salt;
      delete data.password;
      return data;
    });
    return Result.ok(user.data, '查詢成功');
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMettingRoomDto: UpdateUserDto) {
    return this.userService.update(id, updateMettingRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
