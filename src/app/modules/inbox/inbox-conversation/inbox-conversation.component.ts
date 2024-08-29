import { messages } from './../../../mock-api/inbox/data';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, map, take, pipe } from 'rxjs';
import { InboxService } from '../inbox.service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader.component';
import _ from 'lodash';

@Component({
    selector       : 'inbox-conversation',
    templateUrl    : './inbox-conversation.component.html',
    styleUrl       : './inbox-conversation.component.scss',
    standalone     : true,
    imports        : [NgIf, MatSidenavModule, MatButtonModule, RouterLink, MatIconModule, MatMenuModule, NgFor, NgClass, NgTemplateOutlet, MatFormFieldModule, MatInputModule, TextFieldModule, DatePipe, FormsModule, LoaderComponent, MatProgressSpinnerModule],
})
export class InboxConversationComponent implements OnInit, OnDestroy
{
    @ViewChild('messageInput') messageInput!: ElementRef;
    newMessage!     : string
    chatId!         : string;
    chat            : any = {};
    contacts!       : any[];
    isLoading!      : boolean;
    isLoadingChat   : boolean = true;
    isLoadingEdit   : boolean = false;
    repliedConfig!  : any;
    isEdit          : boolean = false;

    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngZone: NgZone,
        private _router: Router,
        private _inboxService: InboxService,
        private _activatedRoute: ActivatedRoute
    )
    {
      this.chatId = this._activatedRoute.snapshot.params['id'];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void
    {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() =>
        {
            setTimeout(() =>
            {
                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit()
    {
      this.contacts      = await this.getContacts();
      this.chat.messages = await this.getMessages();
      this.chat.subject  = await this.getChats();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */

    getMessages(): Promise<any> {
      return new Promise(resolve => {
        this._inboxService.getMessages()
        .pipe(
          take(2),
          takeUntil(this._unsubscribeAll),
          map((messages) =>
            messages.map((message) => ({
              ...message,
              contact: this.contacts.find(contact => contact.id === message.contactId),
              isMine: message.contactId === 'me'
            }))
          )
        )
        .subscribe((messages) => {
          this.chat.participants = _.uniqBy(messages, 'contactId').length;
          resolve(messages)
        })
      })
    }

    getContacts(): Promise<any> {
      this.isLoading = true;
      return new Promise(resolve => {
        this._inboxService.getContacts().pipe(takeUntil(this._unsubscribeAll)).subscribe((contacts) => {
          resolve(contacts)
          this.isLoading = false;
        })
      })

    }

    getChats(): Promise<any> {
      this.isLoadingChat = true;
      return new Promise(resolve => {
        this._inboxService.getChats().pipe(takeUntil(this._unsubscribeAll)).subscribe((chats) => {
          const currentChat = chats.find(chat => chat.id === this.chatId);
          resolve(currentChat.subject);

          this.isLoadingChat = false;
        })
      })

    }

    public sendMessage(): void {
      this.isLoading = true;
      if(this.isEdit) {
        const message = {
          value    : this.newMessage,
          id       : this.repliedConfig.id,
        }
        this._inboxService.updateMessage(message).pipe(takeUntil(this._unsubscribeAll)).subscribe(async () => {
          this.newMessage = '';
          this.chat.messages = await this.getMessages();
          this.repliedConfig = {};
          this.isLoading = false;
        })
      }

      if(!this.isEdit) {
        const message = {
          value    : this.newMessage,
          replying : this.repliedConfig ? this.repliedConfig.reply : null,
        }
        this._inboxService.createMessage(message).subscribe(async () => {
          this.newMessage = '';
          this.chat.messages = await this.getMessages();
          this.repliedConfig = {};
          this.isLoading = false;
        })
      }
    }

    public deleteMessage(message: any): void {
      this.isLoadingEdit = true;
      const newMessage = {
        id: message.id,
        value: null
      };
      this._inboxService.updateMessage(newMessage).pipe(takeUntil(this._unsubscribeAll)).subscribe(async () => {
        this.newMessage = '';
        this.chat.messages = await this.getMessages();
        this.repliedConfig = {};
        this.isLoadingEdit = false;
      })
    }

    public editMessage(message: any): void {
      this.newMessage = message.value;
      this.repliedConfig = {
        isReply: true,
        reply: message.value,
        id: message.id
      }
      this.isEdit = true;
      // this._inboxService.updateMessage(newMessage).pipe(takeUntil(this._unsubscribeAll)).subscribe(async () => {
      //   this.newMessage = '';
      //   this.chat.messages = await this.getMessages();
      //   this.repliedConfig = {};
      //   this.isLoadingEdit = false;
      // })
    }

    public replyMessage(message: any): void {
      this.repliedConfig = {
        isReply: true,
        reply: message.value,
        from: message.contact?.name
      }
    }

    public closeReply() {
      this.repliedConfig = {};
      this.isEdit = false;
    }

    openContactInfo(): void
    {
        // Open the drawer

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void
    {
        // Close the contact info in case it's opened
        this._router?.navigate(['./inbox']);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void
    {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
