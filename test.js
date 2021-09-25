import test from "ava";
import delay from 'delay'
import simpleCache from "./dist/index.js";

const CACHE_TTL = 5
const cache = simpleCache(CACHE_TTL);
const now = () => Date.now().toString();
const cacheItem = { greeting: "Hello World!" };

test("can set value in cache", async (t) => {
  const key = now()
  const value = cache.set(key, cacheItem);
  
  t.is(value, cacheItem);
});

test('cache gets invalidated after TTL', async t => {
  const key = now()
  cache.set(key, cacheItem);

  await delay(CACHE_TTL * 1000);

  const value = cache.get(key)
  t.not(value, cacheItem);
});

test('can programmatically invalidate cache', async t => {
  const key = now()
  cache.set(key, cacheItem, {ttl: 2 * CACHE_TTL});

  await delay(2 * 1000);

  cache.unset(key)

  const value = cache.get(key)
  t.not(value, cacheItem);
});
