import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip, query } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log the incoming request
    this.logger.log(
      `Request: ${method} ${originalUrl} - ${ip} - ${userAgent}${
        Object.keys(query).length ? ` - Query: ${JSON.stringify(query)}` : ''
      }`
    );

    // Log the response using the 'finish' event
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;

      if (statusCode >= 400) {
        // Log as error for client or server errors
        this.logger.error(
          `Response: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`
        );
      } else {
        // Log as info for successful responses
        this.logger.log(
          `Response: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`
        );
      }
    });

    // Log any errors that occur during processing
    res.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      this.logger.error(
        `Error: ${method} ${originalUrl} - ${error.message} - ${responseTime}ms`
      );
    });

    next();
  }
}
