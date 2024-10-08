const Redis = require('ioredis');
const logger = require('./logger');

const createRedisClient = (config = {}) => {
  const redisUrl = process.env.REDIS_URL || 'redis://default:viFgvhJfjdaPQZh7RryLRtXOAN9YYWT3@redis-13266.c44.us-east-1-2.ec2.redns.redis-cloud.com:13266';
  logger.info(`Attempting to connect to Redis at ${redisUrl}`);
  
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      logger.info(`Retrying Redis connection in ${delay}ms...`);
      return delay;
    },
    ...config
  });

  client.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    logger.info('Redis Client Connected Successfully');
  });

  client.on('ready', () => {
    logger.info('Redis Client Ready');
  });

  client.on('close', () => {
    logger.warn('Redis Client Connection Closed');
  });

  return client;
};

module.exports = createRedisClient;