import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { Result } from 'src/common/standardResult';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from 'src/role/role.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Get()
  async getUsers() {
    const user = await this.userService.getAllUsers();
    const { password, salt, ...others } = user.data;
    return Result.ok(others, '查詢成功');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    const { password, salt, ...others } = user.data;
    return Result.ok(others, '查詢成功');
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMettingRoomDto: UpdateUserDto) {
    return this.userService.update(id, updateMettingRoomDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
