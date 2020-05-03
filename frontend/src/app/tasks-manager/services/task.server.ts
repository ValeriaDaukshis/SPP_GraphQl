import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, onErrorResumeNext } from 'rxjs';
import { Task } from '../models/task';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import gql from "graphql-tag";
import { TaskInput } from '../models/taskSend';
import { t } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apollo: Apollo) { }

  getTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
    const getTasks = gql`
        query Tasks($user_id: ID!) {
          Tasks (user_id: $user_id){
            _id
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
        console.log(data.data.Tasks);
        observer.next(data.data.Tasks);
      });
    });
  }

  getSortedByDeadlineTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getSortedByDeadlineTasks = gql`
      query SortedByDeadlineTasks($user_id: ID!) {
            SortedByDeadlineTasks (user_id: $user_id){
              _id
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
        },
        error => {
            console.log("there was an error sending the query", error);
        });
      });
  }

  getSortedByNameTasks(userId: Object): Observable<Array<Task>> {
    return new Observable<Array<Task>>(observer => {
      const getTasks = gql`
          query SortedByNameTasks($user_id: ID!) {
            SortedByNameTasks (user_id: $user_id){
              _id
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
              _id
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
          observer.next(data.data.UnfinishedTasks);
        });
      });
  }

  getTask(taskId: Object): Observable<Task> {
    return new Observable<Task>(observer => {
      const getTask = gql`
          query GetTask($id: ID!) {
            GetTask (id: $id){
              _id
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
          observer.next(data.data.GetTask);
        });
      });
  }

  addTask(task: TaskInput) : Observable<Task> {
    return new Observable<Task>(observer => {
      const addTask = gql`
      mutation addTask(
        $name: String!
        $deadline: String!
        $details: String!
        $isMade: Boolean!
        $user_id: ID!
        ) {
          addTask(
          name: $name
          deadline: $deadline
          details: $details
          isMade: $isMade
          user_id: $user_id
          ) {
            _id
            name
            deadline
            details
            isMade
            user_id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: addTask,
      variables: {
        name: task.name,
        deadline: task.deadline,
        details: task.details,
        isMade: task.isMade,
        user_id: task.user_id,
      },
      fetchPolicy: "no-cache"
      })
      .subscribe((data:any) => {
          observer.next(data.data.addTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  updateTask(task: TaskInput): Observable<Task>{
    return new Observable<Task>(observer => {
      const updateTask = gql`
      mutation updateTask(
        $id: ID!
        $name: String!
        $deadline: String!
        $details: String!
        $isMade: Boolean!
        $user_id: ID!
        ) {
        updateTask(
          id: $id
          name: $name
          deadline: $deadline
          details: $details
          isMade: $isMade
          user_id: $user_id
          ) {
            _id
            name
            deadline
            details
            isMade
            user_id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: updateTask,
      variables: {
        id: task._id,
        name: task.name,
        deadline: task.deadline,
        details: task.details,
        isMade: task.isMade,
        user_id: task.user_id,
      },
      fetchPolicy: "no-cache"
      })
      .subscribe((data:any) => {
          observer.next(data.data.updateTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  setTaskStatus(task2: TaskInput, status2: Boolean): Observable<Object> {
    return new Observable<Object>(observer => {
      const setStatus = gql`
      mutation setStatus(
        $id: ID!
        $status: Boolean!) {
      setStatus(
        id: $id
        status: $status
          ) {
            _id
            name
            deadline
            details
            isMade
            user_id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: setStatus,
      variables: {
          id: task2._id,
          status: status2,
      },
      })
      .subscribe((data:any) => {
          observer.next(data.data.setStatus);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }

  deleteTask(taskId: Object): Observable<Object> {
    return new Observable<Object>(observer => {
      const deleteTask = gql`
      mutation deleteTask(
        $id: ID!) {
          deleteTask(
        id: $id
          ) {
            _id
          }
      }
  `;
  this.apollo
      .mutate({
      mutation: deleteTask,
      variables: {
          id: taskId
      },
      })
      .subscribe((data:any) => {
          observer.next(data.data.deleteTask);
      },
      error => {
          console.log("there was an error sending the query", error);
      });
  });
  }
}
