import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { TaskComponent } from './task.component';
import { TaskService } from './task.service';
import { inject, Injectable } from '@angular/core';
import { tags } from '../../mock-api/task/data';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskViewComponent } from './task-view/task-view.component';
// import { LayoutComponent } from './layout/layout.component';


export const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    // component: LayoutComponent,
    children: [
        {
          path: '',
          component: TaskViewComponent,
        },
        {
          path: ':id',
          component: TaskViewComponent,
        },
    ]
  },
];
