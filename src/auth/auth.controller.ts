import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity} from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@User() user: UserEntity, @Res({passthrough: true}) response: Response) {
        return this.authService.login(user, response);
    }

    @Post('/signup')
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto, @Res({passthrough: true}) response: Response) {
        return this.authService.signup(createUserDto, response);
    }
}
