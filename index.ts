/** Default duration before cache item is invalidated */
const DEFAULT_TTL = 60;
const logger = console.log;
/** Cache duration in seconds */
type seconds = number;

/**
 *
 * @param ttl duration in seconds before cache item is invalidated
 * @returns
 */
export default function simpleCache<T = any>(ttl: seconds = DEFAULT_TTL) {
  const cache = new Map<string, { value: T; timer: number }>();

  return {
    get(key: string) {
      return cache.get(key)?.value;
    },
    set(key: string, value: T, options?: { ttl: seconds }) {
      this.unset(key);

      const timer = setTimeout(() => {
        logger(`invalidating cache item with key ${key}`);
        this.unset(key);
      }, (options?.ttl ?? ttl) * 1000);

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
