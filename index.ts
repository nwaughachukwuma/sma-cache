const DEFAULT_TTL = 60000;
let logger = console.log;
/** Cache duration in milliseconds */
type milliseconds = number;
export interface CacheHandlers<T> {
  get(key: string): T | undefined;
  set<K extends T>(
    key: string,
    value: K,
    options?: { ttl: milliseconds } | undefined
  ): K;
  unset(key: string): boolean;
  hasKey(key: string): boolean;
}

type Q<T> = { value: T; timer: ReturnType<typeof setTimeout> };
export interface Options {
  debug?: boolean;
}

/**
 *
 * @param ttl duration in milliseconds before cache item is invalidated
 * @returns
 */
export default function simpleCache<T = any>(
  ttl: milliseconds = DEFAULT_TTL,
  options?: Options
): CacheHandlers<T> {
  if (!options?.debug) logger = () => {};
  const cache = createStore();
  function createStore() {
    logger("creating cache store");
    return new Map<string, Q<T>>();
  }

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
      if (!cache.has(key)) return false;

      const cached = cache.get(key)!;
      clearTimeout(cached.timer);
      return cache.delete(key);
    },
    hasKey(key: string): boolean {
      return cache.has(key);
    },
  };
}
