import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany
} from 'typeorm';

import Entity from './Entity';
import User from './User';
import Post from './Post';
import { makeId } from '../utils/helpers';
import Vote from './Vote';
import { Exclude, Expose } from 'class-transformer';

@TOEntity('comments')
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  parentId: string | null;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    onDelete: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true
  })
  children: Comment[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  post: Post;

  @Column('simple-array', { default: '' })
  path: string = '';

  @Column({ default: 0 })
  depth: number;

  @BeforeInsert()
  generatePathAndDepth() {
    if (this.parent) {
      const parentIdStr = this.parent.id.toString();

      const parentPath = this.parent.path || '';

      this.path = parentPath ? `${parentPath},${parentIdStr}` : parentIdStr;

      this.depth = (this.parent.depth || 0) + 1;
    } else {
      this.path = '';
      this.depth = 0;
    }
  }

  // Геттер для получения path как массива чисел
  get pathArray(): number[] {
    if (!this.path) return [];
    return this.path
      .split(',')
      .filter(Boolean)
      .map(Number)
      .filter((num) => !isNaN(num));
  }

  // Геттер для получения path как массива строк
  get pathStringArray(): string[] {
    console.log(this.path);
    if (!this.path || typeof this.path !== 'string') {
      return [];
    }

    // Убираем возможные пробелы и пустые элементы
    return this.path
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes
      ? this.votes.reduce((prev, curr) => prev + (curr.value || 0), 0)
      : 0;
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @Expose()
  get isEdited(): boolean {
    return this.updatedAt.getTime() - this.createdAt.getTime() > 60000; // Если разница больше минуты
  }
  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }

  isCommentOwner: boolean;
  setOwner(user: User) {
    this.isCommentOwner = this.username === user.username;
  }
}
