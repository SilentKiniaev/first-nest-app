import { Injectable, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity) private postsRepository: Repository<PostEntity>, 
        private clodinarySevice: CloudinaryService,
        private usersService: UsersService
    ) {}

    async getPosts(currentUser: User, userId?: number): Promise<PostEntity[]> {
        if (userId && currentUser.id !== +userId) {
            const user = await this.usersService.getUserWithFollower(userId, currentUser.id);
            if (user.isPrivate && !user.followers.length) {
                throw new ForbiddenException('Acoount is private');
            }
        }

        return await this.postsRepository
            .createQueryBuilder('post')
            .where({hidden: false})
            .andWhere({ user: userId ?? currentUser.id })
            .orderBy("post.createdAt", "DESC")
            .getMany();
    }

    async createPost(user: User, file: Express.Multer.File, body: CreatePostDto) {
        const uploaded = await this.clodinarySevice.uploadSingleImage(file);
        return this.postsRepository
            .createQueryBuilder()
            .insert()
            .values({
                user, 
                url: uploaded.url,
                ...body
            })
            .execute();
    }

    async updatePost(user: User, postId: number, data: UpdatePostDto) {
        return await this.postsRepository
            .createQueryBuilder()
            .update()
            .set(data)
            .where({
                id: postId,
                user: user.id
            })
            .execute();
    }
}
