import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FollowerToFollowing } from './entities/followers.entity';
import { UsersController } from './users.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
