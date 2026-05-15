import { ProductsService } from './products.service';
import { ICacheService } from '../cache/cache.interface';

class FakeCache implements ICacheService {
  store = new Map<string, unknown>();
  async get<T>(key: string): Promise<T | undefined> {
    return this.store.get(key) as T | undefined;
  }
  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }
  async wrap<T>(key: string, _ttl: number, producer: () => Promise<T> | T): Promise<T> {
    const hit = this.store.get(key);
    if (hit !== undefined) return hit as T;
    const value = await producer();
    this.store.set(key, value);
    return value;
  }
}

describe('ProductsService', () => {
  let service: ProductsService;
  let cache: FakeCache;

  beforeEach(() => {
    cache = new FakeCache();
    service = new ProductsService(cache);
  });

  it('paginates unfiltered results', async () => {
    const res = await service.findAll({ page: 1, limit: 10 });
    expect(res.data).toHaveLength(10);
    expect(res.meta.total).toBe(50);
    expect(res.meta.totalPages).toBe(5);
  });

  it('filters by category', async () => {
    const res = await service.findAll({ page: 1, limit: 100, category: 'Books' });
    expect(res.meta.total).toBe(10);
    expect(res.data.every((p) => p.category === 'Books')).toBe(true);
  });

  it('filters by stock_status', async () => {
    const res = await service.findAll({
      page: 1,
      limit: 100,
      stock_status: 'out_of_stock' as never,
    });
    expect(res.data.every((p) => p.stock_status === 'out_of_stock')).toBe(true);
  });

  it('returns empty page beyond range', async () => {
    const res = await service.findAll({ page: 99, limit: 10 });
    expect(res.data).toHaveLength(0);
    expect(res.meta.total).toBe(50);
  });

  it('uses cache on second identical call', async () => {
    const spy = jest.spyOn(cache, 'wrap');
    await service.findAll({ page: 1, limit: 5 });
    await service.findAll({ page: 1, limit: 5 });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(cache.store.size).toBe(1);
  });
});
