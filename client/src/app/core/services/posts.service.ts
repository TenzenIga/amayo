import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Comment, postPayload } from '@shared/interfaces/interfaces';
import { Post } from 'app/store/state/post.state';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = '/api';


  constructor(private http: HttpClient) { }

  public getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts`);
  }

  public getPost(identifier: string, slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.url}/posts/${identifier}/${slug}`);
  }

  public getPostComments(identifier: string, slug: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}/posts/${identifier}/${slug}/comments`);
  }

  public sendComment(identifier: string, slug: string, body: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.url}/posts/${identifier}/${slug}/comments`, { body });
  }

  public createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.url}/posts`, postData);
  }

  public voteOnPost(identifier: string, slug: string, value: number): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-post`, { identifier, slug, value });
  }

  public voteOnComment(identifier: string, slug: string, value: number): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-comment`, { identifier, slug, value });
  }
}
