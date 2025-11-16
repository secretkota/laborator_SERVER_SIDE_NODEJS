import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start
    const { method, originalUrl } = req
    const { statusCode } = res

    if (statusCode < 400) {
      logger.http(`${method} ${originalUrl} ${statusCode} - ${duration}ms`)
    }
  })

  next()
}