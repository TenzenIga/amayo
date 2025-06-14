import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "app/store/state/user.state";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UserService {
    private http:HttpClient = inject(HttpClient)
    private url = '/api';

    public getUserInfo(username: string):Observable<User> {
        return this.http.get<User>(`${this.url}/users/${username}`)
    } 
}