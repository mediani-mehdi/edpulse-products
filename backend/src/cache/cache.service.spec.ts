import { Test } from '@nestjs/testing';
import { CacheModule } from './cache.module';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule],
    }).compile();
    service = moduleRef.get(CacheService);
  });

  it('returns undefined on miss', async () => {
    expect(await service.get('missing')).toBeUndefined();
  });

  it('stores and retrieves value', async () => {
    await service.set('k1', { a: 1 }, 60);
    expect(await service.get('k1')).toEqual({ a: 1 });
  });

  it('wrap calls producer once on miss, then returns cached', async () => {
    const producer = jest.fn(() => ({ value: 42 }));
    const first = await service.wrap('w1', 60, producer);
    const second = await service.wrap('w1', 60, producer);
    expect(first).toEqual({ value: 42 });
    expect(second).toEqual({ value: 42 });
    expect(producer).toHaveBeenCalledTimes(1);
  });
});
