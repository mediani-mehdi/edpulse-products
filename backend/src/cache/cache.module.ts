import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CACHE_SERVICE } from './cache.interface';

@Module({
  imports: [NestCacheModule.register({ isGlobal: false, ttl: 60_000 })],
  providers: [
    CacheService,
    { provide: CACHE_SERVICE, useExisting: CacheService },
  ],
  exports: [CACHE_SERVICE, CacheService],
})
export class CacheModule {}
