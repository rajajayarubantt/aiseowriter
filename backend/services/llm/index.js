const GeminiServices = require("./gemini");

class GenerationService {
    constructor() {
        this.llms = [new GeminiServices()];
    }

    async generate(request) {
        let response = {
            success: false,
            data: null,
            message: "",
        };

        for (const llm of this.llms) {
            response = await llm.generate(request);
            if (response.success) {
                break;
            }
        }

        return response;
    }

    async generateImage(request) {
        let response = {
            success: false,
            data: null,
            message: "",
        };

        for (const llm of this.llms) {
            response = await llm.generateImage(request);
            if (response.success) {
                break;
            }
        }

        return response;
    }
}

export default GenerationService;
