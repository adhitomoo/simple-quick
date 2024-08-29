import { Routes } from '@angular/router';
import { InboxComponent } from './inbox.component';
import { InboxNewChatComponent } from './inbox-new-chat/inbox-new-chat.component';
import { InboxConversationComponent } from './inbox-conversation/inbox-conversation.component';
// import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
        {
          path: '',
          component: InboxComponent
          // loadChildren: () => import('./modules/homepage/homepage.routes')
        },
        {
          path: ':id',
          component: InboxConversationComponent
          // loadChildren: () => import('./modules/homepage/homepage.routes')
        },
    ]
  },
];
