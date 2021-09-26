# Sma-cache

A simple cache that automatically invalidates items after a given TTL. Runs on node and on the browser

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

The cacheItem will automatically invalidate after TTL, so that:

```js
cache.get(key); // => undefined
```

## API

### simpleCache(ttl)

Returns a `cache object` which exposes methods to interact with the cache

### ttl

Time in seconds before the item stored with `key: random-key` is invalidated

Type: number <br>
Default: 60

### Cache Object API

The cache object exposes the following API

- **set(key, options)**: store an item in the cache
  - **key**: the key for the cache item
    Type: string
    Required: true
  - **options**
    - **ttl**: Set a custom ttl for a cache item
      Type: number
      Default: global `ttl`
- **get(key)**: get a cache item
  - **key**: the key for the cache item
   Type: string
   Required: true
- **unset(key)**: remove an item from the cache
  - **key**: the key for the cache item
    Type: string
    Required: true
