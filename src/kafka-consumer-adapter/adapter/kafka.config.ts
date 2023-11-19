import {
  KafkaConfig as KafkaClientConfig,
  ConsumerConfig,
  ConsumerSubscribeTopics,
} from 'kafkajs';

export type KafkaConfig = {
  client: KafkaClientConfig;
  consumer: ConsumerConfig;
  subscribe: ConsumerSubscribeTopics;
};
