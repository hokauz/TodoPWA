import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, mergeMapTo } from 'rxjs/operators';

import { Task, Response, ResponseBuider } from '../entity';
import { TaskRepository } from './task.repository';

@Injectable({
  providedIn: 'root',
})
/**
 * Implementação das regras de negócio.
 *
 * Esta classe poderia ser unida com a TaskRepository, mas
 * foi separada para poder focar melhor no que ela realmente é responsável que
 * é definir modelos de respostas e implementar regras de negócio para a aplicação.
 *
 * Como nosso backend não possui algumas das verificações que usamos, aqui
 * foram implementadas 5 coisas importantes.
 *
 * 1. Padronização de repostas em contexto assíncrono (ResponseBuilder)
 * 2. Padronização das mensagens de erro e sucesso
 * 3. Atribuição das mensagem para o seu contexto adequado (create, update...)
 * 4. Bloqueio de atualização de uma task que já foi completada (algo a ser feito no component tbm, mas
 * foi deixado aqui também para simbolizar a importancia de uma regra de negócio não depender totalmente
 * do front para ser validada)
 * 5. Implementação workarround (rs) para delete de lista de atividades completas. (Feature não presente na api fornecida)
 */
export class TaskService {
  private genericError = 'Algo insperado aconteceu, poderia tentar novamente?';

  private messages = {
    CREATE: {
      success: 'Nova tarefa adicionada!',
      code: 'create-task',
    },
    UPDATE: {
      success: 'A tarefa foi atualizada!',
      error: 'Esta tarefa já foi completada',
      code: 'update-task',
    },
    DELETE: {
      success: 'Tarefa removida!',
      code: 'delete-task',
    },
    DELETE_ALL_COMPLETED: {
      success: 'Lista de tarefa completadas está limpa!',
      code: 'delete-all-task-tasks',
    },
  };

  constructor(private repo: TaskRepository) {}

  create(task: Task): Observable<Response<Task>> {
    return this.repo.post(task).pipe(
      map(
        (res) => ResponseBuider.makeSuccess<Task>(res, this.messages.CREATE.success),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError, this.messages.CREATE.code)))
      )
    );
  }

  update(task: Task): Observable<Response<Task>> {
    if (task.completed) {
      of(ResponseBuider.makeError(this.messages.UPDATE.code, this.messages.UPDATE.error));
    }

    return this.repo.put(task).pipe(
      map(
        (res) => ResponseBuider.makeSuccess<Task>(res, ''),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError, this.messages.UPDATE.code)))
      )
    );
  }

  delete(task: Task): Observable<Response<undefined>> {
    return this.repo.delete(task.url).pipe(
      map(
        (res) => ResponseBuider.makeSuccess<undefined>(res, this.messages.DELETE.success),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError, this.messages.DELETE.code)))
      )
    );
  }

  deleteAllCompleted(): Observable<Response<undefined>> {
    return this.repo.getAll().pipe(
      map((tasks: Task[]) => tasks.filter((t) => t.completed)),
      mergeMapTo((list: Task[]) => list.map((i) => this.repo.delete(i.url))),
      map(
        () => ResponseBuider.makeSuccess<undefined>(undefined, this.messages.DELETE_ALL_COMPLETED.success),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError, this.messages.DELETE_ALL_COMPLETED.code)))
      )
    );
  }

  read(url: string): Observable<Response<Task>> {
    return this.repo.get(url).pipe(
      map(
        (res) => ResponseBuider.makeSuccess<Task>(res),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError)))
      )
    );
  }

  readAll(): Observable<Response<Task[]>> {
    return this.repo.getAll().pipe(
      map(
        (res) => ResponseBuider.makeSuccess<Task[]>(res),
        catchError((e) => of(ResponseBuider.makeError(e, this.genericError)))
      )
    );
  }
}
