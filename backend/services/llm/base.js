const RedisClient = require("../../helpers/redis");

const MINUTE_SECONDS = 60;
const DAY_SECONDS = 86400;

class Base {
    constructor(name) {
        this.redisCli = new RedisClient();
        this.name = name;
        this.requestKey = `${this.name}_request_count`;
        this.records = [];

    }

    async canHandle() {
        const raw = await this.redisCli.get(this.requestKey);
        const data = JSON.parse(raw || "[]");

        this.records = data;

        if (!data || data.length === 0) {
            return true;
        }

        let todayTotalRequests = 0;
        let currentMinRequests = 0;
        let currentMinTokens = 0;
        const now = Math.floor(Date.now() / 1000);

        for (const d of data) {
            if (d.time >= now - MINUTE_SECONDS) {
                currentMinRequests += d.count || 0;
                currentMinTokens += d.tokens || 0;
            }
            if (d.time >= now - DAY_SECONDS) {
                todayTotalRequests += d.count || 0;
            }
        }

        if (
            todayTotalRequests === 0 &&
            currentMinRequests === 0 &&
            currentMinTokens === 0
        ) {
            return true;
        }

        if (
            todayTotalRequests > this.rpd ||
            currentMinRequests > this.rpm ||
            currentMinTokens > this.tpm
        ) {
            return false;
        }

        return true;
    }

    async generate(request) {
        if (!(await this.canHandle())) {
            return { success: false, message: `${this.name} exceeded limits.` };
        }

        const response = await this._generate(request);

        const data = {
            time: Math.floor(Date.now() / 1000),
            type: "text",
            count: 1,
        };

        if (response?.success) {
            const tokenResponse = response.token_response;
            if (tokenResponse) {
                data.tokens = tokenResponse.total;
            }
        }

        this.records.push(data);
        await this.redisCli.set(this.requestKey, JSON.stringify(this.records));

        return response;
    }

    async generateImage(request) {
        if (!(await this.canHandle())) {
            return { success: false, message: `${this.name} exceeded limits.` };
        }

        const response = await this._generateImage(request);

        const data = {
            time: Math.floor(Date.now() / 1000),
            type: "image",
            count: 1,
        };

        if (response?.success) {
            const tokenResponse = response.token_response;
            if (tokenResponse) {
                data.tokens = tokenResponse.total;
            }
        }

        this.records.push(data);
        await this.redisCli.set(this.requestKey, JSON.stringify(this.records));

        return response;
    }

    // Abstract methods - must be overridden in subclasses
    async _generate(request) {
        throw new Error("_generate() must be implemented by subclass");
    }

    async _generateImage(request) {
        throw new Error("_generateImage() must be implemented by subclass");
    }
}

module.exports = Base;
