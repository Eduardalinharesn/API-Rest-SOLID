import { app } from './app';
import { env } from './env';

app
  .listen({
    //0.0.0.8
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!');
  });
