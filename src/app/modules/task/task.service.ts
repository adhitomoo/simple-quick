import { tasks } from './../../mock-api/task/data';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TagModel, TaskModel } from './task.type';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TaskService
{
    // Private
    private _tags : BehaviorSubject<TagModel[]> = new BehaviorSubject<TagModel[]>([]);
    private _task : BehaviorSubject<TaskModel[]> = new BehaviorSubject<TaskModel[]>([]);
    public task$  : Observable<TaskModel[]> = this._task.asObservable();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    get tags$(): Observable<TagModel[]> {
        return this._tags.asObservable();
    }

    getTags(): Observable<TagModel[]> {
      return this._httpClient.get<TagModel[]>('api/tasks/tags')
    }

    public getTasks(): Observable<TaskModel[]> {
      return this._httpClient.get<TaskModel[]>('api/tasks/all')
    }

    public getTaskId(id: string): Observable<TaskModel> {
      return this._httpClient.get<TaskModel>(`api/tasks/search`, {params: {id}})
    }

    public createTask(task: TaskModel): Observable<TaskModel> {
      return this._httpClient.post<TaskModel>('api/tasks/task', { task })
    }

    public updateTask(task: TaskModel): Observable<TaskModel> {
      return this._httpClient.put<TaskModel>('api/tasks/task', { task })
    }

    public deleteTask(uuid: string): Observable<any> {
      return this._httpClient.delete<any>('api/tasks/task', {params: { id: uuid }})
    }
}

