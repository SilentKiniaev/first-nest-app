import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    OneToMany, 
    ManyToMany, 
    CreateDateColumn, 
    UpdateDateColumn, 
    JoinTable 
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';
import { FollowerToFollowing } from './followers.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column()
    username: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password?: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'photo_url', nullable: true })
    photoUrl: string;

    @Column({ name: 'is_private', default: false })
    isPrivate: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    @Exclude({ toPlainOnly: true })
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.user, { /* , eager: true */ })
    posts: Post[];

    // @OneToMany(() => FollowerToFollowing, item => item.following)
    // public followers: FollowerToFollowing[];

    // @OneToMany(() => FollowerToFollowing, item => item.follower)
    // public followings: FollowerToFollowing[];

    @ManyToMany(() => User, (user) => user.followings)
    @JoinTable({ 
        name: 'followers_to_followings',
        joinColumn: {
            name: 'following_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'follower_id',
            referencedColumnName: 'id'
        }
    })
    followers: User[];

    @ManyToMany(() => User, (user) => user.followers)
    followings: User[];

    toJSON() {
        return instanceToPlain(this);
    }
}