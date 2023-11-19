import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { KafkaRequest } from './kafka-consumer-adapter/adapter/kafka-consumer.adapter';

export const Key = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: KafkaRequest = ctx.getArgByIndex(0);
    return request.keyJson;
  },
);
