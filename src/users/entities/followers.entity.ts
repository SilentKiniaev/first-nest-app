import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class FollowerToFollowing {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column(/*{ name: 'follower_id' }*/)
    public followerId!: number;

    @Column(/*{ name: 'following_id' }*/)
    public followingId!: number;

    // @ManyToOne(() => User, (user) => user.followers)
    // // @JoinColumn({name: 'following_id' })
    // public following!: User;

    // @ManyToOne(() => User, (user) => user.followings)
    // // @JoinColumn({name: 'follower_id' })
    // public follower!: User;
}