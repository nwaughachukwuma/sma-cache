import { expectType, expectAssignable } from "tsd";
import simpleCache from "./index";

const cache = simpleCache(5);
const cacheItem = { greeting: "Hello World!" };
const now = () => Date.now().toString();

const cacheKey = now();
expectType<typeof cacheItem>(cache.set(cacheKey, cacheItem));
expectAssignable<typeof cacheItem | undefined>(cache.get(cacheKey));
