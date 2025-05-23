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
          ? `${process.env.APP_URL}/images/${this.userImage}`
          : `https://ui-avatars.com/api/?length=1&name=${this.username}`;
    }
}
