import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3337),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid enviroment variables', _env.error.message);

  throw new Error('Invalid enviroment viraibles');
}

export const env = _env.data;
