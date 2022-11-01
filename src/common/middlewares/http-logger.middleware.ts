import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface IRequest extends Request {
  user?: { id: number };
}

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: IRequest, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const contentLength = res.getHeader('content-length') || 0;
      const responseTime = Date.now() - startTime;

      let message = '';

      if (process.env.NODE_ENV === 'production') {
        const userId = req.user?.id;
        const formattedUserId = userId ? ` ${userId} ` : ' ';
        const referrer = req.header('Referer') || req.header('Referrer');
        const formattedReferrer = referrer ? ` "${referrer}" ` : ' ';
        const userAgent = req.header('user-agent');

        message = `${req.ip} -${formattedUserId}"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} - ${contentLength}${formattedReferrer}"${userAgent}" \x1b[33m+${responseTime}ms`;
      } else {
        message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${contentLength} \x1b[33m+${responseTime}ms`;
      }

      if (res.statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
