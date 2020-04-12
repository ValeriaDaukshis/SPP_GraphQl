import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskListComponent} from './tasks-manager/lists/task-list.component';
import {TaskFormComponent} from './tasks-manager/forms/task-form.component';
import {DetailTaskFormComponent} from './tasks-manager/forms/detailTask-form.component';
import { LoginComponent } from './login-manager/forms/login-form.component';
import { AuthGuard } from './login-manager/services/auth.guard';
import { RegComponent } from './login-manager/forms/reg-form.component';

const routes: Routes = [
  { path: '', redirectTo: ':userId/tasks', pathMatch: 'full' },
  { path: ':userId/tasks', component: TaskListComponent,  canActivate: [AuthGuard]},
  { path: ':userId/task', component: TaskFormComponent },
  { path: ':userId/task/:id', component: TaskFormComponent },
  { path: ':userId/task/:id/details', component: DetailTaskFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
