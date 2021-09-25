import { expectType, expectAssignable } from "tsd";
import simpleCache from "./index";

const cache = simpleCache<Record<string, any>>(5);
const cacheItem = { greeting: "Hello World!" };
const now = () => Date.now().toString();

const cacheKey = now();
expectType<Record<string, any>>(cache.set(cacheKey, cacheItem));
expectAssignable<Record<string, any> | undefined>(cache.get(cacheKey));
