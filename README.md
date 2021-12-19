# Sma-cache

A simple cache that automatically invalidates a cached item after a given TTL. Runs on node and the browser

## Installation

```shell
# npm
npm install sma-cache

# yarn
yarn add sma-cache

# pnpm
pnpm install sma-cache
```

## Usage

```js
import simpleCache from "sma-cache";

var TTL = 5;
var cache = simpleCache(TTL);
var cacheItem = { greeting: "Hello World!" };
var key = "a-random-key";

cache.set(key, cacheItem);
```

The `cacheItem` will automatically invalidate after TTL, so that:

```js
// using a delay mechanism
delay(TTL);
cache.get(key); // => undefined
```

### Example

```js
import simpleCache from "sma-cache";
import delay from "delay";

const cache = simpleCache(10);
function doSomething() {
  const now = Date.now();
  cache.set("time", now);
  // after 0 s
  delay(0).then(() => {
    console.log(cache.get("time")); //=> now
  });
  // after 5 s
  delay(5000).then(() => {
    console.log(cache.get("time")); //=> now
  });
  // after 10 s
  delay(10000).then(() => {
    console.log(cache.get("time")); //=> undefined
  });
}

doSomething();
```

## API

### simpleCache(ttl)

Returns a `cache object` which exposes methods to interact with the cache

### ttl

Time in milliseconds before the item stored with `key: random-key` is invalidated

Type: number <br>
Default: 60

### Cache Object API

The cache object exposes the following API

- **set(key, options)**: store an item in the cache
  - **key**: the key for the cache item<br>
    Type: string<br>
    Required: true
  - **options**
    - **ttl**: Set a custom ttl for a cache item<br>
      Type: number<br>
      Default: global `ttl`
- **get(key)**: get a cache item
  - **key**: the key for the cache item <br>
    Type: string<br>
    Required: true
- **unset(key)**: remove an item from the cache
  - **key**: the key for the cache item<br>
    Type: string<br>
    Required: true
- **hasKey(key)**: check if item with key exist in cache
  - **key**: the key for the cache item<br>
    Type: string<br>
    Required: true
