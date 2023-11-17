export const MESSAGE_HANDLER_METADATA = 'MESSAGE_HANDLER_METADATA';

export type MessageHandlerMetadata = {
  topic: string;
};

export type MessageHandlerMetadataMap = Record<string, MessageHandlerMetadata>;
