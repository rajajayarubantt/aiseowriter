const { GoogleGenerativeAI } = require("@google/generative-ai");
const AWS = require("aws-sdk");
const Base = require("./base");
const config = require("config");

const Utils = require("../../helpers/utils");

const NAME = "GeminiServices";
const MINUTE_SECONDS = 60;
const DAY_SECONDS = 86400;

class GeminiServices extends Base {
    constructor() {
        super(NAME);

        this.name = NAME;
        this.rpm = 10;
        this.rpd = 250;
        this.tpm = 250000;

        this.API_KEY = config.get("GOOGLE_GEMINI_APIKEY");
        this.API_KEYS = [config.get("GOOGLE_GEMINI_APIKEY")];
        this.MODEL = "gemini-2.5-flash";
        this.apiKeyRecords = [];

        this.AWS_ACCESS_KEY = config.get("AWS_ACCESS_KEY");
        this.AWS_SECRET_ACCESS_KEY = config.get("AWS_SECRET_ACCESS_KEY");
        this.AWS_REGION = config.get("AWS_REGION");
        this.AWS_BUCKET = config.get("AWS_BUCKET");

        // AWS S3 client
        this.s3Client = new AWS.S3({
            accessKeyId: this.AWS_ACCESS_KEY,
            secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
            region: this.AWS_REGION,
        });
    }

    async getApiKey() {
        let apiKey = this.API_KEY;

        for (const key of this.API_KEYS) {
            const requestKey = `${this.name}_${key}_request_key`;
            const raw = await this.redisCli.get(requestKey);
            const data = JSON.parse(raw || "[]");

            this.apiKeyRecords = data;

            if (!data || data.length === 0) {
                apiKey = key;
            }

            let todayTotalRequests = 0;
            let currentMinRequests = 0;
            let currentMinTokens = 0;
            const now = Math.floor(Date.now() / 1000);

            for (const d of data) {
                if (d.time >= now - MINUTE_SECONDS) {
                    currentMinRequests += d.count;
                    currentMinTokens += d.tokens;
                }
                if (d.time >= now - DAY_SECONDS) {
                    todayTotalRequests += d.count;
                }
            }

            if (todayTotalRequests === 0 && currentMinRequests === 0 && currentMinTokens === 0) {
                apiKey = key;
            }

            if (todayTotalRequests > this.rpd || currentMinRequests > this.rpm || currentMinTokens > this.tpm) {
                continue;
            }

            apiKey = key;
        }

        return apiKey;
    }

    async _generate(request) {
        try {
            const prompt = request.prompt || "";
            const format = request.format || "text";

            let responseFormat = null;
            if (format === "json") {
                responseFormat = "application/json";
            } else if (format === "text") {
                responseFormat = "text/plain";
            }

            const API_KEY = await this.getApiKey();
            const client = new GoogleGenerativeAI(API_KEY);

            const model = client.getGenerativeModel({ model: this.MODEL });
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: responseFormat },
            });

            if (!result.response || !result.response.candidates?.length) {
                return { success: false, message: "Failed to generate, Please try again!" };
            }

            const usage = result.response.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const completionTokens = usage.candidatesTokenCount || 0;
            const totalTokens = promptTokens + completionTokens;

            console.log(
                `LLM Tokens: Prompt=${promptTokens} | Result=${completionTokens} | Total=${totalTokens}`
            );

            const output = result.response.text();

            const data = {
                time: Math.floor(Date.now() / 1000),
                type: "text",
                count: 1,
                tokens: totalTokens,
            };

            this.apiKeyRecords.push(data);
            await this.redisCli.set(this.requestKey, JSON.stringify(this.apiKeyRecords));

            return {
                success: true,
                data: output,
                token_response: {
                    prompt: promptTokens,
                    generation: completionTokens,
                    total: totalTokens,
                },
                message: "Generate done successfully!",
            };
        } catch (e) {
            console.error("Error:", e.message);
            return { success: false, message: e.message };
        }
    }

    async uploadToS3(imageBuffer) {
        try {
            const filename = `${Utils.getUniqueId()}.png`;

            await this.s3Client
                .putObject({
                    Bucket: this.AWS_BUCKET,
                    Key: filename,
                    Body: imageBuffer,
                    ContentType: "image/png",
                })
                .promise();

            return `https://${this.AWS_BUCKET}.s3.${this.AWS_REGION}.amazonaws.com/${filename}`;
        } catch (e) {
            console.error("Error uploading to S3:", e.message);
            return null;
        }
    }

    async _generateImage(request) {
        try {
            const prompt = request.prompt || "";

            const API_KEY = await this.getApiKey();
            const client = new GoogleGenerativeAI(API_KEY);

            const model = client.getGenerativeModel({
                model: "gemini-2.0-flash-preview-image-generation",
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { candidateCount: 1 },
            });

            if (!result.response || !result.response.candidates?.length) {
                return { success: false, message: "Failed to generate, Please try again!" };
            }

            const usage = result.response.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const completionTokens = usage.candidatesTokenCount || 0;
            const totalTokens = promptTokens + completionTokens;

            console.log(
                `LLM Tokens: Prompt=${promptTokens} | Result=${completionTokens} | Total=${totalTokens}`
            );

            let imageUrl = null;

            for (const part of result.response.candidates[0].content.parts) {
                if (part.text) {
                    console.log(part.text);
                } else if (part.inlineData) {
                    const buffer = Buffer.from(part.inlineData.data, "base64");
                    imageUrl = await this.uploadToS3(buffer);
                }
            }

            const data = {
                time: Math.floor(Date.now() / 1000),
                type: "image",
                count: 1,
                tokens: totalTokens,
            };

            this.apiKeyRecords.push(data);
            await this.redisCli.set(this.requestKey, JSON.stringify(this.apiKeyRecords));

            return {
                success: true,
                data: imageUrl,
                token_response: {
                    prompt: promptTokens,
                    generation: completionTokens,
                    total: totalTokens,
                },
                message: "Generate done successfully!",
            };
        } catch (e) {
            console.error("Error:", e.message);
            return { success: false, message: e.message };
        }
    }
}

module.exports = GeminiServices;
