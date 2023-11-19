import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: ConsoleLogger;

  constructor() {
    this.logger = new ConsoleLogger(AllExceptionFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);
  }
}
