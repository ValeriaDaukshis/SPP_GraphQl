import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import gql from "graphql-tag";

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

  constructor(private http: HttpClient, private apollo: Apollo) { }

  getTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
    const getTasks = gql`
        query Tasks($user_id: ID!) {
          Tasks (user_id: $user_id){
            id
            name
            deadline
            details
            isMade
            user_id
          }
        }
    `;

    this.apollo
      .watchQuery({
        query: getTasks,
        variables: {
          user_id: userId,
      },
        fetchPolicy: "network-only"
      })
      .valueChanges
      .subscribe((data:any) => {
        observer.next(data.data.Tasks);
      });
    });
  }

  getSortedByDeadlineTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getSortedByDeadlineTasks = gql`
          query SortedByDeadlineTasks($user_id: ID!) {
            SortedByDeadlineTasks (user_id: $user_id){
              id
              name
              deadline
              details
              isMade
              user_id
            }
          }
      `;
  
      this.apollo
        .watchQuery({
          query: getSortedByDeadlineTasks,
          variables: {
            user_id: userId,
        },
        })
        .valueChanges
        .subscribe((data:any) => {
          observer.next(data.data.SortedByDeadlineTasks);
        });
      });
  }

  getSortedByNameTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getTasks = gql`
          query SortedByNameTasks($user_id: ID!) {
            SortedByNameTasks (user_id: $user_id){
              id
              name
              deadline
              details
              isMade
              user_id
            }
          }
      `;
  
      this.apollo
        .watchQuery({
          query: getTasks,
          variables: {
            user_id: userId,
        },
          fetchPolicy: "network-only"
        })
        .valueChanges
        .subscribe((data:any) => {
          observer.next(data.data.SortedByNameTasks);
        });
      });
  }

  getUnfinished(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getTasks = gql`
          query UnfinishedTasks($user_id: ID!) {
            UnfinishedTasks (user_id: $user_id){
              id
              name
              deadline
              details
              isMade
              user_id
            }
          }
      `;
  
      this.apollo
        .watchQuery({
          query: getTasks,
          variables: {
            user_id: userId,
        },
          fetchPolicy: "network-only"
        })
        .valueChanges
        .subscribe((data:any) => {
          if(!data)
          console.log("aaa!null!");
          console.log(data.data);
          observer.next(data.data);
        });
      });
  }

  getTask(userId: Object, taskId: number): Observable<Task> {
    return new Observable<Task>(observer => {
      const getTask = gql`
          query Task($id: ID!) {
            Task (id: $id){
              id
              name
              deadline
              details
              isMade
              user_id
            }
          }
      `;
  
      this.apollo
        .watchQuery({
          query: getTask,
          variables: {
            id: taskId,
        },
          fetchPolicy: "network-only"
        })
        .valueChanges
        .subscribe((data:any) => {
          observer.next(data.data.Task);
        });
      });
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
