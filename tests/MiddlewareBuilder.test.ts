import t from 'tap';
import * as assert from 'assert';
import { MiddlewareBuilder } from '../index';
import { NextCalledMoreThanOnceError } from '../src/NextCalledMoreThanOnceError';

t.mochaGlobals();

interface TestMessage {
  changeMe: string;
}

describe('Middleware Builder', () => {
  it('properly calls the middlewares', () => {
    // GIVEN
    let firstMiddlewareCalled = false;
    let secondMiddlewareCalled = false;

    // WHEN
    new MiddlewareBuilder<void>()
      .use((message, next) => {
        firstMiddlewareCalled = true;
        next();
      })
      .use((message, next) => {
        secondMiddlewareCalled = true;
        next();
      })
      .execute();

    // THEN
    t.equal(firstMiddlewareCalled, true);
    t.equal(secondMiddlewareCalled, true);
  });

  it('accepts many middlewares at once', () => {
    // GIVEN
    let firstMiddlewareCalled = false;
    let secondMiddlewareCalled = false;

    // WHEN
    new MiddlewareBuilder<void>()
      .use(
        (message, next) => {
          firstMiddlewareCalled = true;
          next();
        },
        (message, next) => {
          secondMiddlewareCalled = true;
          next();
        }
      )
      .execute();

    // THEN
    t.equal(firstMiddlewareCalled, true);
    t.equal(secondMiddlewareCalled, true);
  });

  it('properly chains the middlewares in the right order', async () => {
    // GIVEN
    const input: TestMessage = { changeMe: 'TEST' };

    // WHEN
    await new MiddlewareBuilder<TestMessage>()
      .use(async (message, next) => {
        message.changeMe = 'TEST 1';
        await next();
      })
      .use((message, _) => {
        message.changeMe = 'TEST 2';
      })
      .execute(input);

    // THEN
    t.equal('TEST 2', input.changeMe);
  });

  context('next() called multiple times', () => {
    context('async/await callback middlewares', () => {
      it('raises an error', async () => {
        try {
          // GIVEN & WHEN
          await new MiddlewareBuilder<void>()
            .use(async (_, next) => {
              await next();
              await next();
            })
            .execute();
          assert.fail('should fail');
        } catch (error: any) {
          // THEN
          t.equal(error.message, new NextCalledMoreThanOnceError().message);
        }
      });
    });

    context('classic callback middlewares', () => {
      it('raises an error', async () => {
        try {
          // GIVEN & WHEN
          await new MiddlewareBuilder<void>()
            .use((_, next) => {
              next();
              next();
            })
            .execute();
          assert.fail('should fail');
        } catch (error: any) {
          // THEN
          t.equal(error.message, new NextCalledMoreThanOnceError().message);
        }
      });
    });
  });
});
