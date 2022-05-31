import { Injectable } from '@nestjs/common';
import { AppAbility } from '../casl-ability.factory';

@Injectable()
export class CaslAbilityService {
  private _ability: AppAbility;

  get ability(): AppAbility {
    return this._ability;
  }

  set ability(value: AppAbility) {
    this._ability = value;
  }
}
