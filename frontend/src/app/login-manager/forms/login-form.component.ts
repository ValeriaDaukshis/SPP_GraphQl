import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import {User} from '../models/user';


@Component({
    selector: 'app-login-form', 
    templateUrl: 'login-form.component.html'

 })

export class LoginComponent implements OnInit {
    user = new User({}, "", "","");
    loading = false;
    submitted = false;
    returnUrl: String;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            let userId = this.authenticationService.currentUserValue._id;
            this.router.navigate([`${userId}/tasks`]);
        }
    }

   ngOnInit() {
    }

  onSubmit(user: User) {
    this.submitted = true;

    this.loading = true;
    
    this.authenticationService.login(user)
        .subscribe(
            data => {
                console.log(data);
                let userId = data._id;
                this.router.navigate([`${userId}/tasks`]);
            },
            error => {
                this.error = error;
                this.loading = false;
            });
    }

    onRegistrate(user: User) {
        // this.submitted = true;
    
        // this.loading = true;
        // this.authenticationService.registrate(user)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate(['/login']);
        //         },
        //         error => {
        //             this.error = error;
        //             this.loading = false;
        //         });
         }
}





