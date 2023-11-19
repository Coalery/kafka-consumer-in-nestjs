import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { KafkaRequest } from '@app/kafka-consumer-adapter/adapter/kafka-consumer.adapter';

@Injectable()
export class JsonGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: KafkaRequest = context.getArgByIndex(0);

    request.keyJson = request.key
      ? this.parseJsonBufferToObject(request.key)
      : null;
    request.valueJson = request.value
      ? this.parseJsonBufferToObject(request.value)
      : null;

    return request.keyJson && request.valueJson;
  }

  private parseJsonBufferToObject(value: Buffer): Record<string, any> | null {
    try {
      return JSON.parse(value.toString());
    } catch (e) {
      return null;
    }
  }
}
