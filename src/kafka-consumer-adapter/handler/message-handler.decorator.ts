import { Get } from '@nestjs/common';

import {
  MESSAGE_HANDLER_METADATA,
  MessageHandlerMetadata,
} from '@app/kafka-consumer-adapter/handler/message-handler-metadata';

export const MessageHandler =
  (topic: string): MethodDecorator =>
  (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const metadata: MessageHandlerMetadata = { topic };
    Reflect.defineMetadata(
      MESSAGE_HANDLER_METADATA,
      metadata,
      descriptor.value,
    );

    return Get(topic)(target, propertyKey, descriptor);
  };
