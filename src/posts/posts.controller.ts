import { Controller, UseGuards, UseInterceptors, UploadedFile, Req, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity} from '../users/entities/user.entity';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {

    constructor(
        private postsService: PostsService
    ) {}

    @Get('/profile/:id?')
    async getPosts(@User() user: UserEntity, @Param('id') userId: number) {
        return await this.postsService.getPosts(user, userId)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createPost(@User() user: UserEntity, @UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
        await this.postsService.createPost(user, file, body);
        return;
    }

    @Patch(':id')
    async updatePost(@Param('id') id: number, @Body() body: UpdatePostDto, @User() user: UserEntity) {
        await this.postsService.updatePost(user, id, body);
        return;
    }
}
