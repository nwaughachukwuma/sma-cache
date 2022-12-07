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

export interface Options {
  store?: Map<string, { value: any; timer: number }> | LocalStorage;
  debug?: boolean;
}

type Q<T> = { value: T; timer: number };

function wrappedLocalStorage<T>() {
  if (typeof localStorage === "undefined") {
    return new Map<string, Q<T>>();
  }

  return {
    get(key: string) {
      return JSON.parse(localStorage.getItem(key) ?? "");
    },
    set(key: string, v: Q<T>) {
      localStorage.setItem(key, JSON.stringify(v));
    },
    delete(key: string) {
      localStorage.removeItem(key);
    },
    has(key: string) {
      return localStorage.getItem(key) !== null;
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
  options?: Options
): CacheHandlers<T> {
  if (!options?.debug) logger = () => {};
  const cache = initStore();

  function initStore() {
    logger("initializing cache store");
    if (options?.store instanceof Map) {
      return options.store;
    } else if (options?.store) {
      return wrappedLocalStorage<T>();
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
