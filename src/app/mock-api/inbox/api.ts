import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { MockApiService } from '../../../core/mock/mock-api.service';
import { inboxs as InboxData } from './data';

@Injectable({providedIn: 'root'})
export class InboxMockApi
{

    private tags = InboxData;
    constructor(private _mockApiService: MockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
      this._mockApiService.onGet('api/inbox/inboxs').reply(() => {
        return [
          200,
          cloneDeep(this.tags)
        ]
      })
    }
}
