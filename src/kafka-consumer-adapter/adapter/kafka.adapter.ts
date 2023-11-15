import { EmptyAdapter } from './empty.adapter';
import { RequestHandler } from '@nestjs/common/interfaces';
import { KafkaConfig } from './kafka.config';
import { Consumer, Kafka } from 'kafkajs';

type ListenFnCallback = (...args: unknown[]) => void;

export type KafkaRequest = {
  topic: string;
  partition: number;
  offset: number;
  value: unknown;
};

// 비동기 처리라서 응답 객체는 없음
export type KafkaResponse = unknown;

export class DiscordBotAdapter extends EmptyAdapter {
  private readonly kafkaClient: Kafka;
  private readonly kafkaConsumer: Consumer;
  private readonly config: KafkaConfig;

  private readonly commands: Record<string, RequestHandler>;

  constructor(config: KafkaConfig) {
    super('kafka');

    this.kafkaClient = new Kafka(config.client);
    this.kafkaConsumer = this.kafkaClient.consumer(config.consumer);
    this.config = config;

    this.commands = {};

    this.discordClient.on(
      'interactionCreate',
      async (interaction: BaseInteraction) => {
        if (!interaction.isChatInputCommand()) return;
        const request: KafkaRequest = {
          sender: interaction.user,
        };
        const response: DiscordResponse = {
          reply: interaction.reply.bind(interaction),
        };

        const handler = this.commands[interaction.commandName];
        if (!handler) {
          interaction.reply('Command not found');
          return;
        }

        await handler(request, response);
      },
    );
  }

  get(handler: RequestHandler): void;
  get(path: any, handler: RequestHandler): void;
  get(rawPath: unknown, rawHandler?: unknown): void {
    if (!rawHandler) {
      return;
    }

    const path = rawPath as string;
    const handler = rawHandler as RequestHandler;
    const command = this.removeLeadingSlash(path);
    this.commands[command] = handler;
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
