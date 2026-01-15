import { IsEmail, Length } from 'class-validator';
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';

import Entity from './Entity';
import Post from './Post';
import Vote from './Vote';
import Sub from './Sub';

@TOEntity('users')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: 'Must be a valid email' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: 'Username must be at least 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Length(1, 50, { message: 'Nickname can be up to 50 characters long' })
  @Column({ nullable: true, length: 50 })
  nickname: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'ru',
    comment: 'Язык интерфейса пользователя'
  })
  @Column({
    type: 'boolean',
    default: true,
    comment: 'Уведомления о комментариях к постам'
  })
  notificationsComments: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Уведомления об ответах на комментарии'
  })
  notificationsReplies: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Уведомления о лайках'
  })
  notificationsLikes: boolean;

  @Column({ nullable: true })
  userImage: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: 'Password must be at least 6 characters long' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @ManyToMany(() => Sub, (sub) => sub.subscribers)
  @JoinTable()
  subscriptions: Sub[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  @Expose()
  get userImageUrl(): string {
    return this.userImage
      ? `/images/${this.userImage}`
      : `https://ui-avatars.com/api/?length=1&name=${this.username}`;
  }
}
