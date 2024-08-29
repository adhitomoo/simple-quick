import { tags } from './../../../mock-api/task/data';
import { Subject, takeUntil } from 'rxjs';
import { Component, inject, OnDestroy, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TagModel, TaskModel } from '../task.type';
import { TaskService } from '../task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../../shared/components/loader.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'task-create',
  standalone: true,
  imports: [MatIcon, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, LoaderComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  private dialog      = inject(MatDialogRef<TaskCreateComponent>);
  private snackbar    = inject(MatSnackBar);

  public formTask: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    tags: new FormControl([]),
    dueDate: new FormControl(new Date()),
  });

  public tags!         : any;
  @Input() taskId!    : string;

  public task!         : any;

  public isLoading!   : boolean;

  public unsubscribe$ : Subject<boolean> = new Subject<boolean>();

  constructor(
    private _router      : Router,
    private _activeRoute : ActivatedRoute,
    private _taskService : TaskService
  ) {
  }

  async ngOnInit() {

    this.tags = await this.getTags();
    this.task = await this.getTaskById();

    this.formTask.patchValue(this.task);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  getTags() {
    return new Promise((resolve) => {
      this._taskService?.getTags()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tags: TagModel[]) => {
        resolve(tags)
      })
    })
  }

  getTaskById() {
    return new Promise((resolve) => {
      this._taskService?.getTaskId(this.taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task: TaskModel) => {
        resolve(task)
      })
    })
  }

  public submit() {
    this.isLoading = true;
    const formValue = {
      uuid: this.taskId,
      ...this.formTask.value
    };

    this._taskService.updateTask(formValue).subscribe({
      next: (res) => {
        this._router.navigate(['./task']);
        this.snackbar.open('Task Updated', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
        this.isLoading = false;
        this.close();
      },
      error: (err) => {
        this.snackbar.open(err, 'Close', {
          duration: 3000,
          panelClass: 'danger-snackbar'
        })
        this.isLoading = false;
      }
    })
  }

  public close() {
    this.dialog.close();
  }

}
