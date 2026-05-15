import { useEffect } from 'react';
import { useProductsStore } from '../store/useProductsStore';

export function useProducts() {
  const fetch = useProductsStore((s) => s.fetch);
  useEffect(() => {
    void fetch();
  }, [fetch]);
}
