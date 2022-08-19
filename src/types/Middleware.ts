import { Next } from './Next';

export type Middleware<INPUT> = (input: INPUT, next: Next) => void | Promise<void>;
