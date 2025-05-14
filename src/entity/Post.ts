import {Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import { Expose, Exclude } from "class-transformer";
import slugify from 'slugify';

import Entity from './Entity';
import User from "./User";
import { makeId } from "../utils/helpers";
import  Sub  from "./Sub";
import Comment from "./Comment";
import Vote from "./Vote";

@TOEntity('posts')
export default class Post extends Entity{
    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post);
    }

    @Index()
    @Column()
    identifier:string //7 character id

    @Column()
    title: string

    @Index()
    @Column()
    slug: string

    @Column({nullable:true, type: 'text'})
    body: string
     
    @Column({ nullable: true })
    postImage: string;

    @Column()
    subName: string

    @Column()
    username:string

    @ManyToOne(()=> User, user => user.posts)
    @JoinColumn({name: 'username', referencedColumnName: 'username'})
    user:User;

    @ManyToOne(()=> Sub, sub => sub.posts)
    @JoinColumn({name: 'subName', referencedColumnName:'name'})
    sub:Sub

    @Exclude()
    @OneToMany(()=> Comment, comment => comment.post)
    comments: Comment[]

    @Exclude()
    @OneToMany(()=> Vote, vote => vote.post)
    votes: Vote[]
    
    @Expose() get url(): string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`;
    }
    
    @Expose() get commentCount(): number {
        return this.comments ? this.comments.length : 0;
    }  

    @Expose() get voteScore(): number {
        return this.votes ?  this.votes.reduce((prev, curr)=> prev + (curr.value || 0), 0) : 0;
    }  

    @Expose()
    get postImageUrl(): string | undefined {
           return this.postImage ? `${process.env.APP_URL}/images/${this.postImage}` : undefined;
    }

    protected userVote: number
    setUserVote(user: User) {
        const index = this.votes.findIndex(v => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0; 
    }

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7);
        this.slug = slugify(this.title, '_');
    }
}
