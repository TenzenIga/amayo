import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MiscService {
  private url = 'http://localhost:5000/api';


  constructor(private http: HttpClient) { }

  public subscribeToSub(identifier: string, slug: string, value: number): Observable<any> {
    return this.http.post(`${this.url}/misc/subscribe`, { identifier, slug, value });
  }

  public voteOnPost(identifier: string, slug: string, value: number): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-post`, { identifier, slug, value });
  }

  public voteOnComment(identifier: string, slug: string, value: number): Observable<any> {
    return this.http.post(`${this.url}/misc/vote-comment`, { identifier, slug, value });
  }

}
