import { Inject, Injectable } from '@nestjs/common';
import { AUTHORIZATION_ENFORCER } from './constants/token.const';
import { Enforcer } from 'casbin';
import { RoleAction } from './types/action.type';

@Injectable()
export class RoleService {
  constructor(
    @Inject(AUTHORIZATION_ENFORCER)
    private readonly enfError: Enforcer,
  ) {}

  public checkPermission(subject: string, object: string, action: string) {
    return this.enfError.enforce(subject, object, action);
  }

  public mappingAction(method: string): RoleAction {
    switch (method.toUpperCase()) {
      case 'GET':
        return RoleAction.READ;
      case 'POST':
        return RoleAction.CREATE;
      case 'PATCH':
      case 'PUT':
        return RoleAction.UPDATE;
      case 'DELETE':
        return RoleAction.DELETE;
      default:
        return RoleAction.NONE;
    }
  }
}
