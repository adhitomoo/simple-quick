import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { MockApiService } from '../../../core/mock/mock-api.service';
import {
  tags as TagsData,
  tasks as TaskData
} from './data';

import {v4 as uuidv4} from 'uuid'

@Injectable({providedIn: 'root'})
export class TaskMockApi
{

    private tags = TagsData;
    private tasks = TaskData
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
      // GET TAGS
      this._mockApiService
        .onGet('api/tasks/tags')
        .reply(() => {
          return [
            200,
            cloneDeep(this.tags),
          ]
        });

        // GET TASK
        this._mockApiService
        .onGet('api/tasks/all')
        .reply(() => {
          return [
            200,
            cloneDeep(this.tasks),
          ]
        })

        // GET SPECIFIC TASK
        this._mockApiService
        .onGet('api/tasks/search')
        .reply(({ request }) => {
          const uniqueId = request.params.get('id');
          const tasks = cloneDeep(this.tasks);
          const task = tasks.find((item) => item.uuid === uniqueId);
          return [
            200,
            task,
          ]
        })

        // CREATE TASK
        this._mockApiService
        .onPost('api/tasks/task')
        .reply(({request}) =>
        {
            // Get the tag
            const newTask = cloneDeep(request.body.task);

            // Generate a new UUID
            newTask.uuid = uuidv4();

            // Unshift the new tag
            this.tasks.unshift(newTask);

            return [
                200,
                newTask,
            ];
        });

        // UPDATE TASK
        this._mockApiService
        .onPut('api/tasks/task')
        .reply(({request}) =>
          {
          const currentTask = request.body.task;
          this.tasks = this.tasks.map((task) => {
            if(task.uuid === currentTask.uuid) {
              task = currentTask
            }

            return task
          });

          return [
              200,
              currentTask,
          ];
        });

        // PATCH TASK
        this._mockApiService
        .onPatch('api/tasks/task/:id')
        .reply(({request}) =>
          {
          const currentTask = request.body.tasks;
          this.tasks = this.tasks.map((task) => {
            if(task.uuid === currentTask.uuid) {
              task = request.body.tasks
            }

            return task
          });

          return [
              200,
              currentTask,
          ];
        });

        this._mockApiService
        .onDelete('api/tasks/task')
        .reply(({request}) =>
        {
            // Get the id
            const id = request.params.get('id');
            // Find the task and delete it
            const index = this.tasks.findIndex(item => item.uuid === id);
            this.tasks.splice(index, 1);

            return [
                200,
                true,
            ];
        });
    }
}
