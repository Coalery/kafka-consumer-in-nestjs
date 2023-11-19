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
  offset: string;
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  [key: string]: any;
};

// 비동기 처리라서 응답 객체는 없음
export type KafkaResponse = object;

export class KafkaConsumerAdapter extends EmptyAdapter {
  private readonly kafkaClient: Kafka;
  private readonly kafkaConsumer: Consumer;
  private readonly config: KafkaConfig;

  private readonly metadataMap: MessageHandlerMetadataMap;
  private readonly handlers: Record<string, RequestHandler>;

  constructor(module: Type<any>, config: KafkaConfig) {
    super('kafka');

    this.kafkaClient = new Kafka(config.client);
    this.kafkaConsumer = this.kafkaClient.consumer(config.consumer);

    const explorer = new MessageHandlerMetadataExplorer();
    this.metadataMap = explorer.explore(module);

    this.config = config;
    this.handlers = {};
  }

  get(handler: RequestHandler): void;
  get(path: any, handler: RequestHandler): void;
  get(rawPath: unknown, rawHandler?: unknown): void {
    if (!rawHandler) {
      return;
    }

    const path = rawPath as string;
    const handler = rawHandler as RequestHandler;
    const topic = this.removeLeadingSlash(path);

    this.handlers[topic] = handler;
  }

  async initKafkaConsumer(): Promise<void> {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe(this.config.subscribe);
    await this.kafkaConsumer.run({
      eachMessage: async (payload) => {
        const handler = this.handlers[payload.topic];
        if (!handler) {
          return;
        }

        const kafkaRequest: KafkaRequest = {
          topic: payload.topic,
          partition: payload.partition,
          offset: payload.message.offset,
          key: payload.message.key,
          value: payload.message.value,
          timestamp: payload.message.timestamp,
        };
        const kafkaResponse: KafkaResponse = {};
        const next = () => {};
        await handler(kafkaRequest, kafkaResponse, next);
      },
    });
  }

  listen(port: string | number, callback?: () => void): any;
  listen(port: string | number, hostname: string, callback?: () => void): any;
  listen(
    port: unknown,
    hostname?: ListenFnCallback | string,
    rawCallback?: ListenFnCallback,
  ): any {
    let callback: ListenFnCallback = () => {};

    if (typeof hostname === 'function') {
      callback = hostname;
    } else if (typeof rawCallback === 'function') {
      callback = rawCallback;
    }

    this.initKafkaConsumer()
      .then(() => callback())
      .catch((e) => callback(e));
  }

  close() {
    this.kafkaConsumer.disconnect();
  }

  private removeLeadingSlash(path: string): string {
    return path[0] === '/' ? path.substring(1) : path;
  }

  private extract<T>(a?: any, b?: any): T | undefined {
    return a ?? b;
  }
}
