# pipou

Middleware builder

## Usage

Configure the middleware chain by calling `use()`.

Then, `execute()` the chain: this will always return `Promise<void>`
```js
await new MiddlewareBuilder <{someValue: string}> ()
    .use(async (message, next) => {
        message.someValue = 'hi';
        await next();
    })
    .use((message, _) => {
        message.someValue = 'bonjour';
    })
    .execute({someValue: 'hello'});
```

