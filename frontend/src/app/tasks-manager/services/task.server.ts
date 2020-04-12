import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded',
});
  //private url = environment.apiUrl + '/tasks/';
  private url = environment.apiUrl;
  private singleUrl = environment.apiUrl + '/task/';

  constructor(private http: HttpClient) { }

  getTasks(userId: Object): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}${userId}/tasks/`);
  }

  getSortedByDeadlineTasks(userId: Object): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}${userId}/tasks/sortByDeadline/`);
  }

  getSortedByNameTasks(userId: Object): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}${userId}/tasks/sortByName/`);
  }

  getUnfinished(userId: Object): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(`${this.url}${userId}/tasks/getUnfinished/`);
  }

  getTask(userId: Object, taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.url}${userId}/tasks/${taskId}`);
  }

  addTask(task: Task) : Observable<Task> {
   console.log();
    let form = this.init(task);
    return this.http.post<Task>(`${this.url}${task.user_id}/task/`, form.toString(), {headers: this.headers});
  }

  updateTask(task: Task): Observable<Task>{
    let form = this.init(task);
    return this.http.put<Task>(`${this.url}${task.user_id}/task/${task._id}`, form.toString(), {headers: this.headers});
  }

  setTaskStatus(task: Task, status: boolean): Observable<Object> {
    let form = this.init(task);
    return this.http.put<Object>(`${this.url}${task.user_id}/task/${task._id}/status/${status}`, form.toString(), {headers: this.headers});
  }

  deleteTask(userId: Object, taskId: object): Observable<Object> {
    return this.http.delete<Object>(`${this.url}${userId}/task/${taskId}`);
  }

  init( task: Task) {
    let form = new HttpParams()
     .set(`_id`, task._id === null ? null : task._id.toString()) 
     .set(`deadline`, task.deadline)
     .set(`details`, task.details)
     .set(`isMade`, task._id === null ? "false" : task.isMade.toString())
     .set(`name`, task.name)
     .set(`user_id`, task.user_id === null ? null : task.user_id.toString());

     return form;
  }
}
