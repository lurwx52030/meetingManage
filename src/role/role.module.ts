import { Module, DynamicModule } from '@nestjs/common';
import { RoleService } from './role.service';
import { RegisterOptions } from './models/option.model';
import { AUTHORIZATION_ENFORCER } from './constants/token.const';
import { newEnforcer } from 'casbin';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from 'src/auth/stratgies/jwt.strategy';

@Module({ imports: [UserModule] })
export class RoleModule {
  static register(options: RegisterOptions): DynamicModule {
    const { modelPath, policyAdapter, global = false } = options;
    const providers = [
      {
        provide: AUTHORIZATION_ENFORCER,
        useFactory: async () => {
          const enforcer = await newEnforcer(modelPath, policyAdapter);
          return enforcer;
        },
      },
      RoleService,
    ];

    return {
      global,
      providers,
      module: RoleService,
      exports: [...providers],
    };
  }
}
