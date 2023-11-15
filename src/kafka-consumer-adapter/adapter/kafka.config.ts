import { KafkaConfig as KafkaClientConfig, ConsumerConfig } from 'kafkajs';

export type KafkaConfig = {
  client: KafkaClientConfig;
  consumer: ConsumerConfig;
};
