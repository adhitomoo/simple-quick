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
import { map, Subject, takeUntil } from 'rxjs';
import { InboxService } from './inbox.service';
import { chats } from '../../mock-api/inbox/data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const now = DateTime.now();

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSidenavModule, RouterLink, RouterOutlet, InboxNewChatComponent, CommonModule, MatProgressSpinnerModule],
  providers: [DatePipe],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent implements OnInit, OnDestroy {

  drawer          : boolean = false;
  drawerOpened    : boolean = false;
  drawerComponent : string = 'new-chat';
  selectedChat    : any;
  filteredChats   : any = [

  ];
  chats: any = [

  ];

  contacts!: any[];

  unsubscribe$: Subject<boolean> = new Subject();
  isLoading: boolean = true;

  constructor(
    public datepipe: DatePipe,
    private _inboxService: InboxService
  ) {}

  async ngOnInit() {
    this.contacts = await this.getContacts();
    this.chats    = await this.getChats();
    this.filteredChats = this.chats;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  public getChats() {
    this.isLoading = true;
    return new Promise(resolve => {
      this._inboxService.getChats()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(chats => chats.map(chat => ({
          ...chat,
          contacts: this.contacts.filter(c => c.id === chat.contactId)[0],
          // lastMessageAt: this.datepipe.transform( new Date(chat.lastMessageAt), 'dd/MM/yyyy'),
        })))
        // map(chats => chats.map(chat => ({
        //   ...chat,
        //   lastMessageAt: this.datepipe.transform( new Date(chat.lastMessageAt), 'dd/MM/yyyy')
        // })))
      )
      .subscribe(res => {
        resolve(res)
        this.isLoading = false;
      })

    })
  }

  public getContacts(): Promise<any> {
    this.isLoading = true;
    return new Promise(resolve => {
      this._inboxService.getContacts().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
        resolve(res);
        this.isLoading = false;
      })
    })
  }

  filterChats(search: string)
  {
  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
