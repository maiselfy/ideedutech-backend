import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { findSchoolByUser } from 'src/shared/utils/findSchoolByUser.util';

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const school = await findSchoolByUser(request.user.id);

    return {
      ...request.user,
      school: school ? school.name : undefined,
    };
  },
);
