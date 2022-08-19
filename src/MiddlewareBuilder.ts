import { Middlewares } from './types/Middlewares';
import { NextCalledMoreThanOnceError } from './NextCalledMoreThanOnceError';
import { Next } from './types/Next';
import { MiddlewareRegistry } from './MiddlewareRegistry';

export class MiddlewareBuilder<T> {
  private middlewareRegistry = new MiddlewareRegistry<T>();

  use(...middlewares: Middlewares<T>): this {
    middlewares.forEach((arg) => this.middlewareRegistry.enqueue(arg));
    return this;
  }

  async execute(input: T): Promise<void> {
    const next = async () => {
      const nextMiddleware = this.middlewareRegistry.dequeue();
      if (nextMiddleware) {
        await nextMiddleware(input, this.preventManyNextCalls(next));
      }
    };

    return next();
  }

  private preventManyNextCalls(next: Next) {
    let called = false;
    return () => {
      if (called) {
        throw new NextCalledMoreThanOnceError();
      }
      called = true;
      return next();
    };
  }
}
