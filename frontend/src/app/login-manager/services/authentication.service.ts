import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { User } from '../models/user';
import { regUser } from '../models/regUser';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private url = environment.apiUrl+ "login/";
    private reg = environment.apiUrl+ "registrate/";
    private headers: HttpHeaders = new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User) {
        let form = this.init(user);
        return this.http.post<any>(`${this.url}`, form.toString(), {headers: this.headers})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    registrate(user: User) {
        let form = this.init(user);
        return this.http.post<any>(`${this.reg}`, form.toString(), {headers: this.headers})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    init(user: User) {
        let form = new HttpParams()
         .set(`_id`, user._id !== null ? user._id.toString() : null)
         .set(`userName`, user.username)
         .set(`password`, user.password)
         .set(`token`, user.token)
    
         return form;
      }
}