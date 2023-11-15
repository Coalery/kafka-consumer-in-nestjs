import { AppModule } from './app.module';
import { KafkaConsumerAppFactory } from './kafka-consumer-adapter/kafka-consumer-app-factory';

async function bootstrap() {
  const app = await KafkaConsumerAppFactory.create(AppModule);
  await app.listen(0);
}
bootstrap();
