/** Default duration before cache item is invalidated */
const DEFAULT_TTL = 60;
const DEFAULT_LOGGER = console.log;
/** Cache duration in seconds */
type seconds = number;

export default function simpleCache<T = any>(
  ttl: seconds = DEFAULT_TTL,
  logger: typeof DEFAULT_LOGGER = DEFAULT_LOGGER
) {
  const cache = new Map<string, { value: T; timer: number }>();

  return {
    get(key: string) {
      return cache.get(key)?.value;
    },
    set(key: string, value: T, options?: { ttl: seconds }) {
      this.unset(key);

      const timer = setTimeout(() => {
        logger(`invalidating ${key} after timeout`);
        this.unset(key);
      }, (options?.ttl ?? ttl) * 1000);

      cache.set(key, { value, timer });
      return value;
    },
    unset(key: string): boolean {
      if (!cache.has(key)) {
        return false;
      }

      const cached = cache.get(key);
      if (cached) {
        clearTimeout(cached.timer);
      }

      cache.delete(key);
      return true;
    },
    hasKey(key: string): boolean {
      return cache.has(key);
    },
  };
}
