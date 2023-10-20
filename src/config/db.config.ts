import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type dbType = 'mysql' | 'sqlite' | 'mysql_railway';

export default (type: dbType) => {
  return async (config: ConfigService) => {
    let conf: TypeOrmModuleOptions;
    switch (type) {
      case 'mysql':
        conf = {
          type: 'mysql',
          host: config.get('db.mysql.host'),
          port: config.get('db.mysql.port'),
          username: config.get('db.mysql.username'),
          password: config.get('db.mysql.password'),
          database: config.get('db.mysql.database'),
          autoLoadEntities: true,
          synchronize: true,
        };
        break;
      case 'mysql_railway':
        conf = {
          type: 'mysql',
          host: config.get('db.mysql_railway.host'),
          port: config.get('db.mysql_railway.port'),
          username: config.get('db.mysql_railway.username'),
          password: config.get('db.mysql_railway.password'),
          database: config.get('db.mysql_railway.database'),
          autoLoadEntities: true,
          synchronize: true,
        };
        break;
      case 'sqlite':
        conf = {
          type: 'sqlite',
          database: config.get('db.sqlite.database'),
          autoLoadEntities: true,
          synchronize: true,
        };
        break;
      default:
        break;
    }

    return conf;
  };
};
