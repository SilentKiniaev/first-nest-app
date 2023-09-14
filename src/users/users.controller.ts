import { Controller, Get, Param, Body, UseGuards, Patch, Post, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { UserRelationType } from './enums';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity} from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile/:id')
    async getUser(@Param('id') id: number): Promise<UserEntity> {
        return this.usersService.findUser({ id });
    }

    @Patch()
    async updateUser(@Body(ValidationPipe) updateUserDto: UpdateUserDto, @User() user: UserEntity) {
        return this.usersService.updateUser(user, updateUserDto);
    }

    @Post('photo')
    @UseInterceptors(FileInterceptor('image'))
    async uploadProfilePhoto(@UploadedFile() image: Express.Multer.File, @User() user: UserEntity) {
        return this.usersService.uploadProfilePhoto(user, image);
    }

    @Post('follow/:id')
    async follow(@Param('id') targetUserId: number, @User() user: UserEntity) {
        return this.usersService.followUser(user, targetUserId);
    }

    @Post('unfollow/:id')
    async unfollow(@Param('id') targetUserId: number, @User() user: UserEntity){
        return this.usersService.unfollowUser(user, targetUserId);
    }

    @Get('followings/:id?')
    async getFollowings(@User() user: UserEntity, @Param('id') id: number) {
        return this.usersService.getUserRelations(user, UserRelationType.Followings, id);
    }

    @Get('followers/:id?')
    async getFollowers(@User() user: UserEntity, @Param('id') id: number) {
        return this.usersService.getUserRelations(user, UserRelationType.Followers, id);
    }
}
