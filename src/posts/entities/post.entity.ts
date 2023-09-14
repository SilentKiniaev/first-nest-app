import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { instanceToPlain, Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { PostType } from '../enums';

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: PostType,
        // default: PostType.Photo
    })
    type: PostType;

    @Column()
    url: string;

    @Column({ default: false })
    @Exclude({ toPlainOnly: true })
    hidden: boolean;

    @Column({ default: false, name: 'comments_off' })
    commentsOff: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    @Exclude({ toPlainOnly: true })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts, /* { onDelete: 'CASCADE' } */)
    @JoinColumn({ name: 'user_id' })
    user: User;

    toJSON() {
        return instanceToPlain(this);
    }
}
