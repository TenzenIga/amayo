import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post, PostComment, postPayload } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = 'http://localhost:5000/api';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) { }

  public getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.url}/posts`);
  }

  public getPost(identifier: string, slug: string): Observable<Post>{
    return this.http.get<Post>(`${this.url}/posts/${identifier}/${slug}`);
  }

  public voteOnPost(identifier: string, slug: string, value: number): Observable<any>{
    return this.http.post(`${this.url}/misc/vote-post`, {identifier, slug, value});
  }

  public voteOnComment(identifier: string, slug: string, value: number): Observable<any>{
    return this.http.post(`${this.url}/misc/vote-comment`, {identifier, slug, value });
  }

  public getPostCommets(identifier: string, slug: string): Observable<PostComment[]>{
    return this.http.get<PostComment[]>(`${this.url}/posts/${identifier}/${slug}/comments`);
  }

  public sendComment(identifier: string, slug: string, body: string): Observable<PostComment>{
    return this.http.post<PostComment>(`${this.url}/posts/${identifier}/${slug}/comments`, {body}, this.httpOptions);
  }

  public createPost(postData: postPayload): Observable<any>{
    return this.http.post(`${this.url}/posts`, postData, this.httpOptions);
  }
}
