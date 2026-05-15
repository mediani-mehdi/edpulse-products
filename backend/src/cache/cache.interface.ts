export const CACHE_SERVICE = Symbol('CACHE_SERVICE');

export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  wrap<T>(key: string, ttlSeconds: number, producer: () => Promise<T> | T): Promise<T>;
}
