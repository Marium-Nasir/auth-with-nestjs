import { Injectable } from '@nestjs/common';
// import { RedisContext } from '@nestjs/microservices';
import { Redis } from 'ioredis';
// import { RedisClient } from 'ioredis/built/connectors/SentinelConnector/types';

@Injectable()
export class RedisService {
  constructor(private readonly redisService: Redis) {}

  async redisClient(code, time, value) {
    const val = this.redisService.setex(code, time, JSON.stringify(value));
    return val;
  }

  async redisGetData(code) {
    const val = await this.redisService.get(code);
    return val;
  }

  async dltFromRedis(code) {
    await this.redisService.del(code);
  }
}
