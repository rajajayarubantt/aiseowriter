import redis
from typing import Any, Dict, List, Optional, Union

class RedisClient:
    def __init__(self):
        self.pool = redis.ConnectionPool(host="localhost", port=6379, decode_responses=True)
        self.client = redis.Redis(connection_pool=self.pool)

    # ---------- STRING OPERATIONS ----------
    def set(self, key: str, value: Any, ex: Optional[int] = None, px: Optional[int] = None) -> bool:
        return self.client.set(key, value, ex=ex, px=px)

    def get(self, key: str) -> Optional[str]:
        return self.client.get(key)

    def incr(self, key: str, amount: int = 1) -> int:
        return self.client.incr(key, amount)

    def decr(self, key: str, amount: int = 1) -> int:
        return self.client.decr(key, amount)

    def mset(self, mapping: Dict[str, Any]) -> bool:
        return self.client.mset(mapping)

    def mget(self, keys: List[str]) -> List[Optional[str]]:
        return self.client.mget(keys)

    # ---------- LIST OPERATIONS ----------
    def lpush(self, key: str, *values: Any) -> int:
        return self.client.lpush(key, *values)

    def rpush(self, key: str, *values: Any) -> int:
        return self.client.rpush(key, *values)

    def lpop(self, key: str) -> Optional[str]:
        return self.client.lpop(key)

    def rpop(self, key: str) -> Optional[str]:
        return self.client.rpop(key)

    def lrange(self, key: str, start: int, end: int) -> List[str]:
        return self.client.lrange(key, start, end)

    # ---------- HASH OPERATIONS ----------
    def hset(self, key: str, mapping: Dict[str, Any]) -> int:
        return self.client.hset(key, mapping=mapping)

    def hget(self, key: str, field: str) -> Optional[str]:
        return self.client.hget(key, field)

    def hgetall(self, key: str) -> Dict[str, str]:
        return self.client.hgetall(key)

    def hdel(self, key: str, *fields: str) -> int:
        return self.client.hdel(key, *fields)

    # ---------- SET OPERATIONS ----------
    def sadd(self, key: str, *values: Any) -> int:
        return self.client.sadd(key, *values)

    def smembers(self, key: str) -> set:
        return self.client.smembers(key)

    def srem(self, key: str, *values: Any) -> int:
        return self.client.srem(key, *values)

    # ---------- SORTED SET OPERATIONS ----------
    def zadd(self, key: str, mapping: Dict[str, float]) -> int:
        return self.client.zadd(key, mapping)

    def zrange(self, key: str, start: int, end: int, withscores: bool = False) -> List:
        return self.client.zrange(key, start, end, withscores=withscores)

    def zrem(self, key: str, *members: str) -> int:
        return self.client.zrem(key, *members)

    # ---------- KEY OPERATIONS ----------
    def delete(self, *keys: str) -> int:
        return self.client.delete(*keys)

    def exists(self, key: str) -> bool:
        return self.client.exists(key) == 1

    def expire(self, key: str, time: int) -> bool:
        return self.client.expire(key, time)

    def keys(self, pattern: str = "*") -> List[str]:
        return self.client.keys(pattern)

    def flushdb(self) -> bool:
        return self.client.flushdb()

    def flushall(self) -> bool:
        return self.client.flushall()

    # ---------- PUB/SUB ----------
    def publish(self, channel: str, message: str) -> int:
        return self.client.publish(channel, message)

    def subscribe(self, *channels: str):
        pubsub = self.client.pubsub()
        pubsub.subscribe(*channels)
        return pubsub

    # ---------- CONNECTION ----------
    def ping(self) -> bool:
        return self.client.ping()
