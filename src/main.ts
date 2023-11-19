import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { KafkaConsumerAdapter } from '@app/kafka-consumer-adapter/adapter/kafka-consumer.adapter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new KafkaConsumerAdapter(AppModule, {
      client: { brokers: ['localhost:9093'] },
      consumer: { groupId: 'groupId-1' },
      subscribe: { topics: ['user.created', 'user.left'] },
    }),
  );
  app.enableShutdownHooks();
  await app.listen(0);
}
bootstrap();
