import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { User } from '../models/user';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private reg = environment.apiUrl+ "registrate/";
    private headers: HttpHeaders = new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient, private apollo: Apollo) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User) {
         return new Observable<User>(observer => {
            const login = gql`
            mutation login($userName: String!
                            $password: String!) {
            login(
                userName: $userName
                password: $password
                ) {
                    _id
                    userName
                    password
                    token
                }
            }
        `;
        this.apollo
            .mutate({
            mutation: login,
            variables: {
                userName: user.userName,
                password: user.password,
            }
            })
            .subscribe((user:any) => {
                const data = user.data.login;
                localStorage.setItem('currentUser', JSON.stringify(data));
                this.currentUserSubject.next(data);
                observer.next(data);
            },
            error => {
                console.log("there was an error sending the query", error);
            });
        });
    }

    registrate(user: User) {
        let form = this.init(user);
        return this.http.post<any>(`${this.reg}`, form.toString(), {headers: this.headers})
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    init(user: User) {
        let form = new HttpParams()
         .set(`_id`, user._id !== null ? user._id.toString() : null)
         .set(`userName`, user.userName)
         .set(`password`, user.password)
         .set(`token`, user.token)
    
         return form;
      }
}