const Redis = require("ioredis");

class RedisClient {
    constructor() {
        this.client = new Redis({
            host: "127.0.0.1",
            port: 6379,
        });
    }

    // ---------- STRING OPERATIONS ----------
    async set(key, value, ex = null, px = null) {
        const args = [key, value];
        if (ex) args.push("EX", ex);
        if (px) args.push("PX", px);
        return await this.client.set(...args);
    }

    async get(key) {
        return await this.client.get(key);
    }

    async incr(key, amount = 1) {
        return amount === 1 ? this.client.incr(key) : this.client.incrby(key, amount);
    }

    async decr(key, amount = 1) {
        return amount === 1 ? this.client.decr(key) : this.client.decrby(key, amount);
    }

    async mset(mapping) {
        return await this.client.mset(mapping);
    }

    async mget(keys) {
        return await this.client.mget(keys);
    }

    // ---------- LIST OPERATIONS ----------
    async lpush(key, ...values) {
        return await this.client.lpush(key, ...values);
    }

    async rpush(key, ...values) {
        return await this.client.rpush(key, ...values);
    }

    async lpop(key) {
        return await this.client.lpop(key);
    }

    async rpop(key) {
        return await this.client.rpop(key);
    }

    async lrange(key, start, end) {
        return await this.client.lrange(key, start, end);
    }

    // ---------- HASH OPERATIONS ----------
    async hset(key, mapping) {
        return await this.client.hset(key, mapping);
    }

    async hget(key, field) {
        return await this.client.hget(key, field);
    }

    async hgetall(key) {
        return await this.client.hgetall(key);
    }

    async hdel(key, ...fields) {
        return await this.client.hdel(key, ...fields);
    }

    // ---------- SET OPERATIONS ----------
    async sadd(key, ...values) {
        return await this.client.sadd(key, ...values);
    }

    async smembers(key) {
        return await this.client.smembers(key);
    }

    async srem(key, ...values) {
        return await this.client.srem(key, ...values);
    }

    // ---------- SORTED SET OPERATIONS ----------
    async zadd(key, mapping) {
        const args = [];
        for (const [member, score] of Object.entries(mapping)) {
            args.push(score, member);
        }
        return await this.client.zadd(key, ...args);
    }

    async zrange(key, start, end, withscores = false) {
        return withscores
            ? await this.client.zrange(key, start, end, "WITHSCORES")
            : await this.client.zrange(key, start, end);
    }

    async zrem(key, ...members) {
        return await this.client.zrem(key, ...members);
    }

    // ---------- KEY OPERATIONS ----------
    async delete(...keys) {
        return await this.client.del(...keys);
    }

    async exists(key) {
        return (await this.client.exists(key)) === 1;
    }

    async expire(key, time) {
        return await this.client.expire(key, time);
    }

    async keys(pattern = "*") {
        return await this.client.keys(pattern);
    }

    async flushdb() {
        return await this.client.flushdb();
    }

    async flushall() {
        return await this.client.flushall();
    }

    // ---------- PUB/SUB ----------
    async publish(channel, message) {
        return await this.client.publish(channel, message);
    }

    subscribe(...channels) {
        const subscriber = new Redis({
            host: "127.0.0.1",
            port: 6379,
        });
        subscriber.subscribe(...channels);
        return subscriber;
    }

    // ---------- CONNECTION ----------
    async ping() {
        return await this.client.ping();
    }
}

module.exports = RedisClient;
