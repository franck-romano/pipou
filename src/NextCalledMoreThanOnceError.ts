export class NextCalledMoreThanOnceError extends Error {
  constructor() {
    super('Attempted to call next() more than once');
  }
}
