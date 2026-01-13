import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Comment } from '@shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private url = '/api/comments';
  private http: HttpClient = inject(HttpClient);

  public getPostComments(identifier: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}/${identifier}`);
  }

  public sendComment<T>(
    identifier: string,
    body: string,
    commentId?: number
  ): Observable<T> {
    return this.http.post<T>(`${this.url}/${identifier}`, {
      body,
      parentId: commentId
    });
  }

  public deleteComment<T>(identifier: string): Observable<T> {
    return this.http.delete<T>(`${this.url}/${identifier}`);
  }
  public updateComment<T>(identifier: string, body: string): Observable<T> {
    return this.http.put<T>(`${this.url}/${identifier}`, { body });
  }
}
