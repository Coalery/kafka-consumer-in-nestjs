import { Controller } from '@nestjs/common';
import { KAFKA_CONTROLLER_METADATA } from './kafka-controller-metadata';

export const KafkaController = (): ClassDecorator => (target: Function) => {
  Reflect.defineMetadata(KAFKA_CONTROLLER_METADATA, true, target);
  Controller()(target);
};
