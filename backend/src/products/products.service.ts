import { Inject, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { CACHE_SERVICE, ICacheService } from '../cache/cache.interface';
import productsData from './data/products.json';

export interface PaginatedProducts {
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class ProductsService {
  private readonly products: Product[] = productsData as Product[];
  private readonly CACHE_TTL_SECONDS = 60;

  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedProducts> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const category = query.category;
    const stock = query.stock_status;

    const key = `products:p=${page}:l=${limit}:c=${category ?? '*'}:s=${stock ?? '*'}`;

    return this.cache.wrap(key, this.CACHE_TTL_SECONDS, () => {
      const filtered = this.products.filter((p) => {
        if (category && p.category !== category) return false;
        if (stock && p.stock_status !== stock) return false;
        return true;
      });

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return { data, meta: { page, limit, total, totalPages } };
    });
  }
}
