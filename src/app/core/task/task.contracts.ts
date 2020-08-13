import { Observable } from 'rxjs';
import { Task } from '../entity';

/**
 * Seguindo modelo de clean arquitecture
 * este contrato fornece um guia de implementação de
 * qualquer repositório, neste caso, assumimos a uma
 * api externa como fonte de dados.s
 *
 * @export
 * @interface TaskRepositoryContract
 */
export interface TaskRepositoryContract {
  get(url: string): Observable<Task>;
  getAll(): Observable<Task[]>;
  post(task: Task): Observable<Task>;
  put(task: Task): Observable<Task>;
  delete(url: string): Observable<undefined>;
}
