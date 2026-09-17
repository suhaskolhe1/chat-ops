import redis from 'redis';

export const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis connection error:', err));

export const connectRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
};
