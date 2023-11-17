import { Type } from '@app/kafka-consumer-adapter/common/types';
import { KAFKA_CONTROLLER_METADATA } from '@app/kafka-consumer-adapter/handler/kafka-controller-metadata';
import {
  MESSAGE_HANDLER_METADATA,
  MessageHandlerMetadata,
  MessageHandlerMetadataMap,
} from '@app/kafka-consumer-adapter/handler/message-handler-metadata';

type Module = Type<any>;

export class MessageHandlerMetadataExplorer {
  explore(module: Module): MessageHandlerMetadataMap {
    const result: MessageHandlerMetadataMap = {};

    this.exploreInternal(module, result);

    return result;
  }

  private exploreInternal(module: Module, map: MessageHandlerMetadataMap) {
    // forward ref, dynamic module 아직 사용 불가
    // 따라서 무조건 트리 구조이므로 방문 여부 확인하지 않음

    const imports: Module[] = Reflect.getMetadata('imports', module);
    imports.forEach((importedModule) =>
      this.exploreInternal(importedModule, map),
    );

    const controllers = Reflect.getMetadata('controllers', module);
    if (
      !controllers ||
      !Array.isArray(controllers) ||
      controllers.length === 0
    ) {
      return;
    }

    controllers
      .filter((controller) => this.isKafkaController(controller))
      .forEach((controller) => this.exploreController(controller, map));
  }

  private exploreController(
    controller: Type<any>,
    map: MessageHandlerMetadataMap,
  ) {
    Object.values(Object.getOwnPropertyDescriptors(controller.prototype))
      .map((descriptor) =>
        Reflect.getMetadata(MESSAGE_HANDLER_METADATA, descriptor.value),
      )
      .filter((metadata): metadata is MessageHandlerMetadata => !!metadata)
      .forEach((metadata) => (map[metadata.topic] = metadata));
  }

  private isKafkaController(controller: Type<any>): boolean {
    return !!Reflect.getMetadata(KAFKA_CONTROLLER_METADATA, controller);
  }
}
