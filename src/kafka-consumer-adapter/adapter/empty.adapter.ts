import { VersionValue } from '@nestjs/common/interfaces';
import { AbstractHttpAdapter } from '@nestjs/core';
import { NestApplicationOptions, VersioningOptions } from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

import { EmptyHttpServer } from '@app/kafka-consumer-adapter/adapter/empty.http-server';

export class EmptyAdapter extends AbstractHttpAdapter {
  constructor(private readonly type: string) {
    super();
  }

  initHttpServer(options: NestApplicationOptions) {
    this.httpServer = new EmptyHttpServer();
  }

  close() {}
  useStaticAssets(...args: any[]) {}
  setViewEngine(engine: string) {}
  getRequestHostname(request: any) {}
  getRequestMethod(request: any) {}
  getRequestUrl(request: any) {}
  status(response: any, statusCode: number) {}
  reply(response: any, body: any, statusCode?: number) {}
  end(response: any, message?: string) {}
  render(response: any, view: string, options: any) {}
  redirect(response: any, statusCode: number, url: string) {}
  setErrorHandler(handler: Function, prefix?: string) {}
  setNotFoundHandler(handler: Function, prefix?: string) {}
  isHeadersSent(response: any) {}
  setHeader(response: any, name: string, value: string) {}
  registerParserMiddleware(prefix?: string, rawBody?: boolean) {}
  enableCors(
    options: CorsOptions | CorsOptionsDelegate<any>,
    prefix?: string,
  ) {}
  createMiddlewareFactory(): (path: string, callback: Function) => any {
    return (path: string, callback: Function) => {};
  }
  getType(): string {
    return this.type;
  }
  applyVersionFilter(
    handler: Function,
    version: VersionValue,
    versioningOptions: VersioningOptions,
  ): (req: any, res: any, next: () => void) => Function {
    return handler as any;
  }
}
