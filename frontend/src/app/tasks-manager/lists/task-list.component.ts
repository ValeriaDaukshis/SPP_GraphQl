import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from '../services/task.server';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { TaskInput } from '../models/taskSend';

@Component({
  selector: 'app-customer-item',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {

  tasks: Task[];
  today: number;
  userId: Object;
  taskInput: TaskInput;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getAllTasks();
  }

  getAllTasks() {
    this.userId = JSON.parse(localStorage.getItem('currentUser') || '{}')._id;
    console.log(this.userId);
    this.taskService.getTasks(this.userId).subscribe(h => this.getDates(h));
  }

  getDates(h: Task[]){
    this.tasks = h;
    console.log(this.tasks);
    this.today = Date.parse(new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate()).toString());
    this.tasks.forEach(element => {
      if(this.today > Date.parse(element.deadline))
        element.isExpired = true;
    });
  }

  onFinish(id){
    let task = this.tasks.find(f=> f._id === id);
    this.taskInput = task;
    this.taskService.setTaskStatus(this.taskInput, true).subscribe(c => task.isMade = true);
  }

  onUnfinish(id){
    let task = this.tasks.find(f=> f._id === id);
    this.taskInput = task;
    this.taskService.setTaskStatus(this.taskInput, false).subscribe(c => task.isMade = false);
  }

  showUnfinished(){
    this.taskService.getUnfinished(this.userId).subscribe(h => this.getDates(h));
  }

  sortByName(){
    this.taskService.getSortedByNameTasks(this.userId).subscribe(h => this.getDates(h));
  }

  sortByDeadline(){
    this.taskService.getSortedByDeadlineTasks(this.userId).subscribe(h => this.getDates(h));
  }
}
