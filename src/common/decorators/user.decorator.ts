import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEnity } from '../../users/entities/user.entity';

export const User = createParamDecorator<string>(
    (prop, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: UserEnity = request.user;

        return prop ? user?.[prop] : user;
    }
);