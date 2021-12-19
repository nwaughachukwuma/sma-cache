/** Default duration in milliseconds before cache item is invalidated */
const DEFAULT_TTL = 60000;
const logger = console.log;
/** Cache duration in milliseconds */
type milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): T | undefined;
  set<K extends T>(
    key: string,
    value: K,
    options?:
      | {
          ttl: milliseconds;
        }
      | undefined
  ): K;
  unset(key: string): boolean;
  hasKey(key: string): boolean;
}

/**
 *
 * @param ttl duration in milliseconds before cache item is invalidated
 * @returns
 */
export default function simpleCache<T = any>(
  ttl: milliseconds = DEFAULT_TTL
): CacheHandlers<T> {
  const cache = new Map<string, { value: T; timer: number }>();

  return {
    get(key: string) {
      return cache.get(key)?.value;
    },
    set<K extends T>(key: string, value: K, options?: { ttl: milliseconds }) {
      this.unset(key);

      const timer = setTimeout(() => {
        logger(`invalidating cache item with key ${key}`);
        this.unset(key);
      }, options?.ttl ?? ttl);

      cache.set(key, { value, timer });
      return value;
    },
    unset(key: string): boolean {
      if (!cache.has(key)) {
        return false;
      }

      const cached = cache.get(key)!;
      clearTimeout(cached.timer);
      cache.delete(key);

      return true;
    },
    hasKey(key: string): boolean {
      return cache.has(key);
    },
  };
}
