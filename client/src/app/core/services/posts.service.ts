import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Comment } from '@shared/interfaces/interfaces';
import { Post } from 'app/store/state/post.state';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = '/api';
  private http: HttpClient = inject(HttpClient);

  public getFeed<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}/posts`, { params });
  }
  public getPopularPosts<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}/posts/popular`, { params });
  }

  public getPosts<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}/posts/all`, { params });
  }

  public getPost(identifier: string, slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.url}/posts/${identifier}/${slug}`);
  }

  public getPostComments(
    identifier: string,
    slug: string
  ): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.url}/posts/${identifier}/${slug}/comments`
    );
  }

  public sendComment(
    identifier: string,
    slug: string,
    body: string
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.url}/posts/${identifier}/${slug}/comments`,
      { body }
    );
  }

  public createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.url}/posts`, postData);
  }

  public voteOnPost(
    identifier: string,
    slug: string,
    value: number
  ): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-post`, {
      identifier,
      slug,
      value
    });
  }

  public voteOnComment(
    identifier: string,
    slug: string,
    value: number
  ): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-comment`, {
      identifier,
      slug,
      value
    });
  }

  public deletePost(identifier: string, slug: string): Observable<Post> {
    return this.http.delete<Post>(`${this.url}/posts/${identifier}/${slug}`);
  }

  public editPost(
    identifier: string,
    slug: string,
    postData: FormData
  ): Observable<Post> {
    return this.http.put<Post>(
      `${this.url}/posts/${identifier}/${slug}`,
      postData
    );
  }
}
