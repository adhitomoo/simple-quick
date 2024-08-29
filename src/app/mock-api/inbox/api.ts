import { Injectable } from '@angular/core';
import { cloneDeep, forEach } from 'lodash';
import { MockApiService } from '../../../core/mock/mock-api.service';
import { chats as chatsData, contacts as contactsData, messages as messagesData} from './data';

import {v4 as uuidv4} from 'uuid'
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

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

      this._mockApiService
      .onGet('api/inboxs/contact')
      .reply(() =>
      {
          // Clone the chats
          const contacts = cloneDeep(this._contacts);

          // Return the response
          return [200, contacts];
      });

      this._mockApiService
      .onGet('api/inboxs/message')
      .reply(({ request }) =>
      {
        // Clone the chats
        const messages = cloneDeep(this._messages);
        // Return the response
        return [200, messages.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))];
      });

      this._mockApiService
      .onPost('api/inboxs/message')
      .reply(({request}) =>
      {
          // Get the tag
          const newMessage = cloneDeep(request.body.message);
          newMessage.id = uuidv4();
          newMessage.color = '#EEDCFF',
          newMessage.contactId = 'me',
          newMessage.createdAt = now.toISO(),

          this._messages.map((message, index) => {
            if(index === this._messages.length - 1) {
              message.unread = false;
            }

            return message
          })
          this._messages.push(newMessage);

          return [
              200,
              newMessage,
          ];
      });


      this._mockApiService
      .onPatch('api/inboxs/message')
      .reply(({request}) =>
        {
        const currentMessage = request.body.message;
        const key = Object.keys(request.body.message);
        this._messages = this._messages.map((message) => {
          if(message.id === currentMessage.id) {
            forEach(key, (k) => {
              message[k] = currentMessage[k]
            })
          }
          return message
        });

        return [
            200,
            currentMessage,
        ];
      });
    }
}
