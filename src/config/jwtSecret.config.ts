import { ConfigService, registerAs } from '@nestjs/config';
import yamlConfig from './app.yamlConfig';

export default registerAs('secrets', () => {
  const configService = new ConfigService();
  const jwt = configService.get('jwt.secret');
  // console.log(jwt);
  return { jwt };
});
