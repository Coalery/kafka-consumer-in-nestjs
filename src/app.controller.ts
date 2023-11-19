import { Req, UseFilters, UseGuards } from '@nestjs/common';

import { KafkaRequest } from '@app/kafka-consumer-adapter/adapter/kafka-consumer.adapter';
import { KafkaController } from '@app/kafka-consumer-adapter/handler/kafka-controller.decorator';
import { MessageHandler } from '@app/kafka-consumer-adapter/handler/message-handler.decorator';

import { AppService } from '@app/app.service';
import { JsonGuard } from '@app/json.guard';
import { AllExceptionFilter } from '@app/all-exception.filter';
import { Key } from './key.decorator';
import { UserCreatedDto } from './user-created.dto';

@KafkaController()
@UseFilters(AllExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessageHandler('user.created')
  @UseGuards(JsonGuard)
  userCreated(@Req() request: KafkaRequest, @Key() key: UserCreatedDto): void {
    console.log(JSON.stringify(request, null, 2));
    console.log(JSON.stringify(key, null, 2));
  }

  @MessageHandler('user.left')
  userLeft(@Req() request: KafkaRequest): void {
    console.log(this.appService.getHello());
  }
}
