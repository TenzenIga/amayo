import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { subPayload, ValdiateSubInput } from '@shared/interfaces/interfaces';
import { Sub } from 'app/store/state/sub.state';

@Injectable({
  providedIn: 'root'
})
export class SubService {
  private url = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  public getSub(subName: string): Observable<Sub> {
    return this.http.get<Sub>(`${this.url}/subs/${subName}`);
  }

  public getTopSubs(): Observable<Sub[]> {
    return this.http.get<Sub[]>(`${this.url}/misc/top-subs`);
  }

  public createSub(subPayload: subPayload): Observable<Sub> {
    return this.http.post<Sub>(`${this.url}/subs`, subPayload);
  }

  public validateSub(subPayload: subPayload): Observable<ValdiateSubInput> {
    return this.http.post<ValdiateSubInput>(
      `${this.url}/subs/validateSub`,
      subPayload
    );
  }
  public searchSubs(subName: string): Observable<Sub[]> {
    return this.http.get<Sub[]>(`${this.url}/subs/search/${subName}`);
  }

  public subscribeToSub(name:string): Observable<any> {
    return this.http.post(`${this.url}/misc/subscribe`, { name });
  }

}
