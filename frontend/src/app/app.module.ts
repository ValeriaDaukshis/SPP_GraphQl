import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { TaskService } from './tasks-manager/services/task.server';
import {TaskListComponent} from './tasks-manager/lists/task-list.component';
import {TaskFormComponent} from './tasks-manager/forms/task-form.component';
import {DetailTaskFormComponent} from './tasks-manager/forms/detailTask-form.component';
import { LoginComponent } from './login-manager/forms/login-form.component';
import { AuthenticationService } from './login-manager/services/authentication.service';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { RegComponent } from './login-manager/forms/reg-form.component';
import { GraphQLModule } from "./graphql.module";

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent,
    DetailTaskFormComponent,
    LoginComponent,
    RegComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    GraphQLModule
  ],
  providers: [
    HttpClient,
    TaskService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
