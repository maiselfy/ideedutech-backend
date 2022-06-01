import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CaslAbilityService } from '../casl/services/casl.ability.service';
import { CHECK_POLICIES_KEY } from '../decorators/policy.decorator';
import { PolicyHandler } from '../handlers/policy.handler';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private caslAbilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();

    let ability = this.caslAbilityFactory.createForUser(user);

    if (user.type === 'admin') {
      ability = this.caslAbilityFactory.createForAdmin();
    } else if (user.type === 'manager') {
      //ability = this.caslAbilityFactory.createForManager(user);
    } else if (user.type === 'user') {
      //ability = this.caslAbilityFactory.createForUser(user);
    } else if (user.type === 'establishment') {
      //ability = this.caslAbilityFactory.createForEstablishment(user);
    }

    this.caslAbilityService.ability = ability;

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
