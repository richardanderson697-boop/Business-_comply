// src/main.ts
import { RedisIoAdapter } from './adapters/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // FIX 3: SCALABILITY
  // This allows multiple servers to "talk" to each other via Redis
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();
  app.useWebSocketAdapter(redisAdapter);

  await app.listen(process.env.PORT || 3000);
}
