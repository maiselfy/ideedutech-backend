import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAbilityService } from './services/casl.ability.service';

@Module({
  providers: [CaslAbilityFactory, CaslAbilityService],
  exports: [CaslAbilityFactory, CaslAbilityService],
})
export class CaslModule {}
