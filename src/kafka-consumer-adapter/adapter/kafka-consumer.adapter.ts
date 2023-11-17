import { RequestHandler } from '@nestjs/common/interfaces';
import { Consumer, Kafka } from 'kafkajs';

import { EmptyAdapter } from '@app/kafka-consumer-adapter/adapter/empty.adapter';
import { KafkaConfig } from '@app/kafka-consumer-adapter/adapter/kafka.config';
import { Type } from '@app/kafka-consumer-adapter/common/types';
import { MessageHandlerMetadataExplorer } from '@app/kafka-consumer-adapter/explorer/message-handler-metadata-explorer';
import { MessageHandlerMetadataMap } from '@app/kafka-consumer-adapter/handler/message-handler-metadata';

type ListenFnCallback = (...args: unknown[]) => void;

export type KafkaRequest = {
  topic: string;
  partition: number;
  offset: number;
  value: unknown;
};

// 비동기 처리라서 응답 객체는 없음
export type KafkaResponse = unknown;

export class KafkaConsumerAdapter extends EmptyAdapter {
  private readonly kafkaClient: Kafka;
  private readonly kafkaConsumer: Consumer;
  private readonly config: KafkaConfig;

  private readonly commands: Record<string, RequestHandler>;
  private readonly metadataMap: MessageHandlerMetadataMap;

  constructor(module: Type<any>, config: KafkaConfig) {
    super('kafka');

    this.kafkaClient = new Kafka(config.client);
    this.kafkaConsumer = this.kafkaClient.consumer(config.consumer);

    const explorer = new MessageHandlerMetadataExplorer();
    this.metadataMap = explorer.explore(module);

    console.log(this.metadataMap);

    this.config = config;
  }

  get(handler: RequestHandler): void;
  get(path: any, handler: RequestHandler): void;
  get(rawPath: unknown, rawHandler?: unknown): void {
    // if (!rawHandler) {
    //   return;
    // }
    // const path = rawPath as string;
    // const handler = rawHandler as RequestHandler;
    // const command = this.removeLeadingSlash(path);
    // this.commands[command] = handler;
  }

  listen(port: string | number, callback?: () => void): any;
  listen(port: string | number, hostname: string, callback?: () => void): any;
  listen(port: unknown, hostname?: unknown, rawCallback?: unknown): any {
    const callback = this.extract<ListenFnCallback>(hostname, rawCallback);
    this.kafkaConsumer
      .connect()
      .then(() => callback())
      .catch((e) => callback(e));
  }

  private removeLeadingSlash(path: string): string {
    return path[0] === '/' ? path.substring(1) : path;
  }

  private extract<T>(a?: any, b?: any): T | undefined {
    return a ?? b;
  }
}
