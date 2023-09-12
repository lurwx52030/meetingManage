import { ApiResponseProperty } from '@nestjs/swagger';

export class Result {
  constructor(code = 0, msg?: string, data?: any) {
    this.status = code;
    this.msg = msg || 'ok';
    this.data = data || null;
  }

  @ApiResponseProperty({ type: 'number' })
  status: number;

  @ApiResponseProperty({ type: 'string' })
  msg?: string;

  @ApiResponseProperty()
  data?: any;

  static ok(data?: any, msg?: string): Result {
    return new Result(200, msg, data);
  }

  static fail(code: number, msg?: string, data?: any): Result {
    return new Result(code || 500, msg || 'fail', data);
  }
}
