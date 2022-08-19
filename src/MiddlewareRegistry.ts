import { Middleware } from './types/Middleware';

export class MiddlewareRegistry<T> {
  private _store: Middleware<T>[] = [];

  enqueue(val: Middleware<T>) {
    this._store.push(val);
  }

  dequeue(): Middleware<T> | undefined {
    return this._store.shift();
  }
}
