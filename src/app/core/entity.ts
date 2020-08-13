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

export interface Task {
  title: string;
  order: number | null;
  completed?: boolean;
  url?: string;
  text?: string;
}
