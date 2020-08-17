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
  get(url?: string): Promise<Task[]>;
  post(task: Task): Promise<Task>;
  put(task: Task): Promise<Task>;
  delete(target: string): Promise<undefined>;
}
