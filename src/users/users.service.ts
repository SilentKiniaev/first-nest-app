import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm'
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRelationType } from './enums';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private cloudinaryService: CloudinaryService
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const user = this.usersRepository.create(createUserDto);
        const result = await this.usersRepository.save(user);
        return result;
    }

    async updateUser(user: User, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update({ id: user.id }, updateUserDto);
    }

    async findUser(filter: FindOptionsWhere<User>): Promise<User> {
        if(!filter || !Object.keys(filter).length)
            return null;
        return this.usersRepository.findOneBy(filter);
    }

    async uploadProfilePhoto(user: User, image: Express.Multer.File) {
        const uploaded = await this.cloudinaryService.uploadSingleImage(image);
        return this.usersRepository
            .createQueryBuilder()
            .update('user')
            .set({ photoUrl: uploaded.url })
            .where({ id: user.id })
            .execute();
    }

    async followUser(user: User, followUserId: number) {
        if (user.id === followUserId) {
            throw new BadRequestException();
        }
        
        return this.usersRepository
            .createQueryBuilder()
            .relation('followings')
            .of(user.id)
            .add(followUserId);
    }

    async unfollowUser(user: User, unfollowUserId: number) {
        return this.usersRepository
            .createQueryBuilder()
            .relation('followings')
            .of(user)
            .remove(unfollowUserId);
    }

    async getUserWithFollower(userId: number, followerId: number): Promise<User> {
        return this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect(
                'user.followers', 
                'follower', 
                'follower.id = :id', 
                { id: followerId }
            )
            .where({ id: userId })
            .getOne();
    }

    async getUserRelations(user: User, relationType: UserRelationType, targetUserId?: number) {
        if (targetUserId && user.id !== +targetUserId) {
            const targetUser = await this.getUserWithFollower(targetUserId, user.id);
            if (targetUser.isPrivate && !targetUser.followers.length) {
                throw new ForbiddenException('Account is private');
            }
        }

        return this.usersRepository
            .createQueryBuilder()
            .relation(relationType)
            .of(targetUserId ?? user.id)
            .loadMany();
    }
}
