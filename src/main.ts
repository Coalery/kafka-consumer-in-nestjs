import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { KafkaConsumerAdapter } from '@app/kafka-consumer-adapter/adapter/kafka-consumer.adapter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new KafkaConsumerAdapter(AppModule, {
      client: { brokers: ['http://localhost:9092'] },
      consumer: { groupId: 'groupId' },
    }),
  );
  await app.listen(0);
}
bootstrap();
