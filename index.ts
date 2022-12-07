/** Default duration in milliseconds before cache item is invalidated */
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

type LocalStorage = typeof localStorage | undefined;
type Q<T> = { value: T; timer: number };

export interface Options<T> {
  store?: Map<string, { value: T; timer: number }> | LocalStorage;
  debug?: boolean;
}

function wrappedLocalStorage<T>(_s: LocalStorage) {
  if (typeof _s === "undefined") {
    return new Map<string, Q<T>>();
  }

  return {
    get(key: string) {
      return JSON.parse(_s.getItem(key) ?? "") as Q<T> | undefined;
    },
    set(key: string, v: Q<T>) {
      _s.setItem(key, JSON.stringify(v));
    },
    delete(key: string) {
      const hasItem = _s.getItem(key) !== null;
      _s.removeItem(key);
      return hasItem;
    },
    has(key: string) {
      return _s.getItem(key) !== null;
    },
  };
}

/**
 *
 * @param ttl duration in milliseconds before cache item is invalidated
 * @returns
 */
export default function simpleCache<T = any>(
  ttl: milliseconds = DEFAULT_TTL,
  options?: Options<T>
): CacheHandlers<T> {
  if (!options?.debug) logger = () => {};
  const cache = initStore();

  function initStore() {
    logger("initializing cache store");
    if (options?.store instanceof Map) {
      return options.store;
    } else if (options?.store) {
      return wrappedLocalStorage<T>(options.store);
    }

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
