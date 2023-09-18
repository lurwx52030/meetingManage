import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
