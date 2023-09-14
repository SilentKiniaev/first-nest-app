import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        MulterModule.register({
            // dest: './public',
            preservePath: true
        }),
        CloudinaryModule,
        UsersModule
    ],
    exports: [TypeOrmModule],
    providers: [PostsService],
    controllers: [PostsController]
})
export class PostsModule {}
