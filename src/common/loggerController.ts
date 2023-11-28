import { Logger } from '@nestjs/common';

class commonLogger {
  readonly logger = new Logger(this.constructor.name);

  constructor() {}
}

export default commonLogger;
