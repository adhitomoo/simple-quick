import { tasks } from './../../../mock-api/task/data';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskService } from '../task.service';
import { HttpClient } from '@angular/common/http';
import { TaskModel } from '../task.type';
import { DatePipe, NgFor } from '@angular/common';
import { map, Subject, Subscription, takeUntil } from 'rxjs';

import {v4 as uuidv4} from 'uuid'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader.component';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { TaskCreateComponent } from '../task-create/task-create.component';

interface CategoryTaskModel {
  name: string;
  value: string
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, TaskListComponent, NgFor, RouterOutlet, LoaderComponent, MatDialogTitle, MatDialogContent],
  providers: [DatePipe],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent implements OnDestroy, OnInit {
  private dialog    = inject(MatDialog)
  private datepipe  = inject(DatePipe)
  private _snackbar = inject(MatSnackBar)

  categories: CategoryTaskModel[] = [
    {
      name: 'My Task',
      value: 'task'
    },
    {
      name: 'Personal Errands',
      value: 'personal'
    },
    {
      name: 'Urgent To Do',
      value: 'urgent'
    }
  ]

  tasks!: TaskModel[];
  isLoading: boolean = false;

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  routeQueryParams$!: Subscription;

  constructor(
    private _taskService  : TaskService,
    private _httpClient   : HttpClient,
    private _router       : Router,
    private _activeRoute  : ActivatedRoute
  ) {
    this.routeQueryParams$ = this._activeRoute.params.subscribe((res) => {
      if (res['id']) {
        this.openDialog();
      }
    })
  }

  ngOnInit(): void {
    this._router.events
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this._activeRoute.snapshot.paramMap.get('id');
        if (id) {
          this.openDialog();
        }
      }
    });

    this.getTasks();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
    this.routeQueryParams$.unsubscribe();
  }

  public getTasks() {
    this.isLoading = true;
    this._taskService.getTasks()
    .pipe(
      takeUntil(this.unsubscribe$),
      map((tasks: TaskModel[]) => tasks.map((task) => ({...task,
        dueDate: this.datepipe.transform(task.dueDate, 'MMMM dd, yyyy h:mm'),
        countDate: task?.dueDate ? this.getTotalDay(task?.dueDate) : ''  }
      )) ))
    .subscribe({
      next: (tasks) => {
        this.isLoading = false
        this.tasks = tasks
      }
    })
  }

  public createTask() {
    this.isLoading = true;
    const task = {
      uuid: '',
      title: 'Untitled',
      done: false,
      tags: [],
      description: 'No Description',
      priority: 0
    }

    this._taskService.createTask(task).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.getTasks();
        // this.openDialog()
        // this._router.navigate(['./task'], { queryParams: { id: res.uuid }, relativeTo: this._activeRoute } );
        this._router.navigate(['./task/', res.uuid]);
      }
    })
  }

  public openDialog() {
    const dialogRef = this.dialog.open(
      TaskCreateComponent,
      {
        minWidth: '500px',
      }
    )

    dialogRef.componentInstance.taskId = this._activeRoute.snapshot.paramMap.get('id') || '';

    dialogRef.afterClosed().subscribe(result => {
      this._router.navigate(['./task']);
      this.getTasks();
    });
  }

  public getTotalDay(dueDate: any): string {
    const today = new Date();
    const endDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const diffrenceDate = endDate.getTime() - today.getTime();

    const totalDays = Math.round(diffrenceDate / (1000 * 3600 * 24));

    return totalDays >= 1 ? totalDays.toString() : 'Expired';
  }

  public editTask(uuid: string) {
    this._router.navigate(['./task/', uuid]);
  }

  public deleteTask(uuid: string) {
    this._taskService.deleteTask(uuid).subscribe(() => {
      this._snackbar.open('Task deleted', '', {duration: 2000, panelClass: 'success-snackbar'});
      this.getTasks();
    })
  }

}
