import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../task.service';
import { MatSelect } from '@angular/material/select';
import { TagModel, TaskModel } from '../task.type';
import { from, Subject, take, takeUntil } from 'rxjs';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

import {v4 as uuidv4} from 'uuid'
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'task-list',
  standalone: true,
  imports: [MatCheckboxModule, MatExpansionModule, MatIcon, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatSelect, MatOption, FormsModule, MatMenuModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnDestroy, OnInit {

  private _taskService = inject(TaskService);
  private _snackbar = inject(MatSnackBar);

  public taskDone: boolean = false;

  readonly panelOpenState = signal(false);
  @Input()  task!: TaskModel
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();

  tags!: TagModel[];
  isLoading!: boolean;

  unsubscribe$: Subject<boolean> = new Subject<boolean>();


  constructor(
  ) {
  }

  ngOnInit(): void {
    this._taskService?.getTags()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tags) => {
        this.tags = tags;
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  deleteTask(uuid: string) {
    this.onDelete.emit(uuid);
  }

}
