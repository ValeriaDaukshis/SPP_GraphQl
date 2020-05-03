import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

import { User } from '../models/user';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { NullInjector } from '@angular/core/src/di/injector';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private user: User;

    constructor(private apollo: Apollo) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
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
        return new Observable<User>(observer => {
            const registration = gql`
            mutation registration($userName: String!
                        $password: String!) {
            registration(
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
            mutation: registration,
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

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null!);
    }
}