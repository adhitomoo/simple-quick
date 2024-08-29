import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InboxService {

  constructor(
    private _httpClient: HttpClient
  ) { }


  public getChats(): Observable<any[]> {
    return this._httpClient.get<any[]>('api/inboxs/chat')
  }

  public getContacts(): Observable<any[]> {
    return this._httpClient.get<any[]>('api/inboxs/contact')
  }

  public getMessages(chatId?: string): Observable<any[]> {
    return this._httpClient.get<any[]>(`api/inboxs/message`)
  }

  public createMessage(message: any): Observable<any> {
    return this._httpClient.post<any>('api/inboxs/message', { message })
  }

  public updateMessage(message: any): Observable<any> {
    return this._httpClient.patch<any>('api/inboxs/message', { message })
  }
}
