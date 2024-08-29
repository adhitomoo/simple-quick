import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
// import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
        {
          path: '',
          component: AppComponent
          // loadChildren: () => import('./modules/homepage/homepage.routes')
        },
        {
          path: 'inbox',
          loadChildren: () => import('./modules/inbox/inbox.routes').then(m => m.routes)
        },
        {
          path: 'task',
          loadChildren: () => import('./modules/task/task.routes').then(m => m.routes)
        },
    ]
  },
];
