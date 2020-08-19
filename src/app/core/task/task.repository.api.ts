import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TaskRepositoryContract } from './task.contracts';
import { Task } from '../entity';
import { NetworkService } from 'src/app/services/network/network.service';
import { switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

/**
 * Apenas para fim de Separation of concerns,
 * foi separado a forma de conexão ao repositório,
 * no caso, uma api externa, das regras de negócio.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskRepositoryApi implements TaskRepositoryContract {
  private path = 'https://todo-backend-golang.herokuapp.com/todos';

  constructor(private http: HttpClient, private network: NetworkService) {}

  get(): Promise<Task[]> {
    return this.http.get<any>(this.path).toPromise();
    // return this.checkOffline<Task[]>(this.http.get<any>(this.path));
  }

  post(task: Task): Promise<Task> {
    return this.http.post<any>(this.path, task).toPromise();
    // return this.checkOffline<Task>(this.http.post<any>(this.path, task));
  }

  put(task: Task): Promise<Task> {
    return this.http.patch<any>(task.url, task).toPromise();
    // return this.checkOffline<Task>(this.http.patch<any>(task.url, task));
  }

  delete(target: string): Promise<undefined> {
    return this.http.delete<any>(target).toPromise();
    // return this.checkOffline<undefined>(this.http.delete<any>(target));
  }

  private checkOffline<T>(request: Observable<any>): Promise<T> {
    return this.network
      .isOnline()
      .pipe(switchMap((state) => (state ? request : throwError('Offline'))))
      .toPromise();
  }
}
