import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import yamlConfig from 'src/config/app.yamlConfig';
import jwtSecretConfig from './jwtSecret.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [yamlConfig('../../config.yml'), jwtSecretConfig],
      isGlobal: true,
    }),
  ],
  exports: [],
})
export class AppConfigModule {}
