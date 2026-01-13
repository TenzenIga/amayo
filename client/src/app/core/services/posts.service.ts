import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post } from 'app/store/state/post.state';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = '/api/posts';
  private http: HttpClient = inject(HttpClient);

  public getFeed<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}`, { params });
  }
  public getPopularPosts<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}/popular`, { params });
  }

  public getPosts<T>(page: number): Observable<T> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10');
    return this.http.get<T>(`${this.url}/all`, { params });
  }
  // TO DO переделать
  public getPostsBySub<T>(subName: string): Observable<T> {
    return this.http.get<T>(`${this.url}/sub/${subName}`);
  }

  public getPost(identifier: string): Observable<Post> {
    return this.http.get<Post>(`${this.url}/${identifier}`);
  }

  public createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.url}`, postData);
  }

  public deletePost(identifier: string): Observable<Post> {
    return this.http.delete<Post>(`${this.url}/${identifier}`);
  }

  public editPost<T>(identifier: string, postData: FormData): Observable<T> {
    return this.http.put<T>(`${this.url}/${identifier}`, postData);
  }
}
