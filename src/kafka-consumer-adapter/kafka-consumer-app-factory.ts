import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export class KafkaConsumerAppFactory {
  static async create<T extends INestApplication = INestApplication>(
    module: any,
    options?: NestApplicationOptions,
  ): Promise<T> {
    const app = await NestFactory.create<T>(module, options);
    return app;
  }
}
