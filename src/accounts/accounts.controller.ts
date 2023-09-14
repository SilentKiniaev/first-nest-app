import { Controller } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('accounts')
export class AccountsController {
    constructor(private usersService: UsersService) {}

    
}
