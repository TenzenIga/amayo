import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';

import Entity from './Entity';
import User from './User';
import Post from './Post';
import { Expose } from 'class-transformer';

@TOEntity('subs')
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;
   
  @Column({ nullable: true })
  rules: string

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.subscriptions)
  subscribers: User[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `/images/${this.bannerUrn}`
      : undefined;
  }

  @Expose()
  get subscribersCount(): number {
    return this.subscribers ? this.subscribers.length : 0;
  }

  subscriptionStatus: boolean;
  setStatus(user: User) {
    this.subscriptionStatus = this.subscribers.some(
      (s) => s.username === user.username
    );
  }

  isSubOwner: boolean;
  setOwner(user: User) {
    this.isSubOwner = this.username === user.username;
  }
}
