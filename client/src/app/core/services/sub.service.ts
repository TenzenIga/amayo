import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sub, subPayload } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class SubService {
  private url = 'http://localhost:5000/api';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) { }

  public getSub(subName: string): Observable<Sub>{
    return this.http.get<Sub>(`${this.url}/subs/${subName}`);
  }

  public getTopSubs(): Observable<Sub[]>{
    return this.http.get<Sub[]>(`${this.url}/misc/top-subs`);
  }

  public createSub(subPayload: subPayload): Observable<Sub>{
    return this.http.post<Sub>(`${this.url}/subs`, subPayload, this.httpOptions);
  }
  
  public searchSubs(subName: string): Observable<Sub[]>{
    return this.http.get<Sub[]>(`${this.url}/subs/search/${subName}` );
  }
  
}
