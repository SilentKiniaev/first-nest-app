import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async checkUser(username: string, password: string): Promise<User> {
        const user = await this.usersService.findUser({ username });
        if (!user)
            return null;

        const match = await bcrypt.compare(password, user.password);
        if (match)
            return user;

        return null;
    }

    private generateTokens(payload: object) {
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '365d' });
        return { accessToken, refreshToken };
    }

    async login(user: User, response: Response) {
        const { password, ...payload} = user;
        const { accessToken, refreshToken } =  this.generateTokens(payload);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true, /* secure: true */
        });

        return { access_token: accessToken }
    }

    async signup(createUserDto: CreateUserDto, response: Response) {
        const userExists = await this.usersService.findUser({ username: createUserDto.username });

        if (userExists)
            throw new BadRequestException('Try another username');

        const hashedPassword = await bcrypt.hash(createUserDto.password, 8);
        const { password, ...payload } = await this.usersService.createUser({ ...createUserDto, password: hashedPassword });

        const { accessToken, refreshToken } = this.generateTokens(payload);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true, /* secure: true */
        });

        return { access_token: accessToken }
    }
}
