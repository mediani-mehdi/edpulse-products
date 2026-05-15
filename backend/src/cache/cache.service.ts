import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheService } from './cache.interface';

@Injectable()
export class CacheService implements ICacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return (await this.cache.get<T>(key)) ?? undefined;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await this.cache.set(key, value, ttlSeconds * 1000);
  }

  async wrap<T>(key: string, ttlSeconds: number, producer: () => Promise<T> | T): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      this.logger.debug(`CACHE HIT  ${key}`);
      return cached;
    }
    this.logger.debug(`CACHE MISS ${key}`);
    const value = await producer();
    await this.set(key, value, ttlSeconds);
    return value;
  }
}
