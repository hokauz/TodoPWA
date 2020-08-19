export class Response<T> {
  constructor(
    public ok?: boolean,
    public error?: boolean,
    public data?: T,
    public message?: string,
    public code?: string
  ) {}
}

export class ResponseBuider {
  static makeSuccess<T>(data?: T, msg?: string): Response<T> {
    return new Response(true, false, data, msg);
  }

  static makeError(origin: string, msg: string, code?: string): Response<undefined> {
    console.log(`Error - ${code}: ${origin}`);
    return new Response(false, true, undefined, msg, code);
  }
}

export class Task {
  id?: string;
  title: string;
  order: number;
  completed?: boolean;
  url?: string;
  text?: string;
  location?: string;
  _synced?: boolean;
  _deleted?: boolean;

  constructor(title: string, order: number, completed: boolean = false) {
    this.title = title || '';
    this.order = order;
    this.completed = completed;
    this._synced = false;
    this._deleted = false;
    this.text = new Date().toISOString();
  }
}

export function toAPI(task: Task): Task {
  return {
    title: task.title,
    order: task.order,
    completed: task.completed,
    url: task.url,
    text: task.text,
  };
}
