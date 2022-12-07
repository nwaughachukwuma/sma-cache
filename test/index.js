import test from "ava";
import delay from "delay";
import simpleCache from "../dist/index.js";

const CACHE_TTL = 5 * 1000;
const cache = simpleCache(CACHE_TTL, { debug: true });
const now = () => Date.now().toString();
const cacheItem = { greeting: "Hello World!" };

test("can set value in cache", (t) => {
  const key = now();
  const value = cache.set(key, cacheItem);

  t.is(value, cacheItem);
});

test("can override ttl", (t) => {
  const key = now();
  const OVERRIDE_TTL = 3 * 1000;
  const value = cache.set(key, cacheItem, { ttl: OVERRIDE_TTL });

  t.is(value, cacheItem);
});

test("cache gets invalidated after TTL", async (t) => {
  const key = now();
  cache.set(key, cacheItem);

  const BUFFER_TIME = 1000;
  await delay(CACHE_TTL + BUFFER_TIME);

  const value = cache.get(key);
  t.not(value, cacheItem);
});

test("can programmatically invalidate cache", async (t) => {
  const key = now();
  cache.set(key, cacheItem, { ttl: 2 * CACHE_TTL });

  // delay for half the time
  await delay(CACHE_TTL);

  const value1 = cache.get(key);
  t.is(value1, cacheItem);

  cache.unset(key);

  const value2 = cache.get(key);
  t.not(value2, cacheItem);
});

test("can initialize the cache with a Map object store", (t) => {
  const key = now();
  const store = new Map();
  const cache = simpleCache(CACHE_TTL, { store });

  cache.set(key, cacheItem);
  t.is(cache.get(key), cacheItem);
});
