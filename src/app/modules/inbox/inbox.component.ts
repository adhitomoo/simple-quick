import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DateTime } from 'luxon';
import { InboxNewChatComponent } from "./inbox-new-chat/inbox-new-chat.component";
import { Subject } from 'rxjs';

const now = DateTime.now();

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSidenavModule, RouterLink, RouterOutlet, InboxNewChatComponent, CommonModule],
  providers: [DatePipe],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {

  drawer          : boolean = false;
  drawerOpened    : boolean = false;
  drawerComponent : string = 'new-chat';
  selectedChat    : any;
  filteredChats   : any = [
    {
      id           : 'ff6bc7f1-449a-4419-af62-b89ce6cae0aa',
      contactId    : '9d3f0e7f-dcbd-4e56-a5e8-87b8154e9edf',
      contact      :     {
        id         : '9d3f0e7f-dcbd-4e56-a5e8-87b8154e9edf',
        avatar     : '',
        name       : 'Dejesus Michael',
        about      : 'Hi there! I\'m using FuseChat.',
        details    : {
            emails      : [
                {
                    email: 'dejesusmichael@mail.org',
                    label: 'Personal',
                },
                {
                    email: 'michael.dejesus@vitricomp.io',
                    label: 'Work',
                },
            ],
            phoneNumbers: [
                {
                    country    : 'bs',
                    phoneNumber: '984 531 2468',
                    label      : 'Mobile',
                },
                {
                    country    : 'bs',
                    phoneNumber: '806 470 2693',
                    label      : 'Work',
                },
            ],
            title       : 'Track Service Worker',
            company     : 'Vitricomp',
            birthday    : '1975-01-10T12:00:00.000Z',
            address     : '279 Independence Avenue, Calvary, Guam, PO4127',
        },
    },
      unreadCount  : 2,
      muted        : false,
      subject      : 'Jeannette Moraima Guaman Chamba (Hutto I-589) [ Hutto Follow Up - Brief Service ]',
      lastMessage  : 'See you tomorrow!',
      lastMessageAt: now.toISO(),
  },
  ];
  chats: any = [
    {
        id           : 'ff6bc7f1-449a-4419-af62-b89ce6cae0aa',
        contactId    : '9d3f0e7f-dcbd-4e56-a5e8-87b8154e9edf',
        contact      :     {
          id         : '9d3f0e7f-dcbd-4e56-a5e8-87b8154e9edf',
          avatar     : '',
          name       : 'Dejesus Michael',
          about      : 'Hi there! I\'m using FuseChat.',
          details    : {
              emails      : [
                  {
                      email: 'dejesusmichael@mail.org',
                      label: 'Personal',
                  },
                  {
                      email: 'michael.dejesus@vitricomp.io',
                      label: 'Work',
                  },
              ],
              phoneNumbers: [
                  {
                      country    : 'bs',
                      phoneNumber: '984 531 2468',
                      label      : 'Mobile',
                  },
                  {
                      country    : 'bs',
                      phoneNumber: '806 470 2693',
                      label      : 'Work',
                  },
              ],
              title       : 'Track Service Worker',
              company     : 'Vitricomp',
              birthday    : '1975-01-10T12:00:00.000Z',
              address     : '279 Independence Avenue, Calvary, Guam, PO4127',
          },
      },
        unreadCount  : 2,
        muted        : false,
        lastMessage  : 'See you tomorrow!',
        lastMessageAt: '26/04/2021',
    },
    {
        id           : '4459a3f0-b65e-4df2-8c37-6ec72fcc4b31',
        contactId    : '16b9e696-ea95-4dd8-86c4-3caf705a1dc6',
        unreadCount  : 0,
        muted        : false,
        lastMessage  : 'See you tomorrow!',
        lastMessageAt: '26/04/2021',
    },
  ];

  constructor(
    public datepipe: DatePipe
  ) {}

  filterChats(search: string)
  {
    console.log(search);
  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
