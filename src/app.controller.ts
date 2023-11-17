import { AppService } from '@app/app.service';
import { KafkaController } from '@app/kafka-consumer-adapter/handler/kafka-controller.decorator';
import { MessageHandler } from '@app/kafka-consumer-adapter/handler/message-handler.decorator';

@KafkaController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessageHandler('user.created')
  getHello(): string {
    return this.appService.getHello();
  }
}
