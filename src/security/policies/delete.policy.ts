// import {
//   AppAbility,
//   AppSubjects,
// } from 'src/shared/security/casl/caslAbility.factory';
import { IPolicyHandler } from '../handlers/policy.handler';
// import { Action } from 'src/shared/security/casl/models/actions.model';
import { AppAbility, AppSubjects } from '../casl/casl-ability.factory';
import { Action } from '../casl/models/actions';

export class DeletePolicyHandler implements IPolicyHandler {
  constructor(private subject: AppSubjects) {}

  handle(ability: AppAbility) {
    return ability.can(Action.Delete, this.subject);
  }
}
