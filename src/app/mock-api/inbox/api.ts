import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { MockApiService } from '../../../core/mock/mock-api.service';
import { chats as chatsData, contacts as contactsData, messages as messagesData} from './data';

@Injectable({providedIn: 'root'})
export class InboxMockApi
{

    private _chats: any[] = chatsData;
    private _contacts: any[] = contactsData;
    private _messages: any[] = messagesData;
    constructor(private _mockApiService: MockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();


        this._chats = this._chats.map(chat => ({
          ...chat,
          // Get the actual contact object from the id and attach it to the chat
          contact: this._contacts.find(contact => contact.id === chat.contactId),
          // Since we use same set of messages on all chats, we assign them here.
          messages: this._messages.map(message => ({
              ...message,
              chatId   : chat.id,
              contactId: chat.contactId,
              isMine   : message.contactId === 'me',
          })),
      }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
      this._mockApiService
      .onGet('api/inboxs/chat')
      .reply(() =>
      {
          // Clone the chats
          const chats = cloneDeep(this._chats);

          // Return the response
          return [200, chats];
      });
    }
}
