import axios from "axios";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";


const API_KEYS = process.env.GEMINI_API_KEYS.split(",");
let currentKeyIndex = 0;

const callGeminiApi = async (message) => {
    let lastError;

    for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[currentKeyIndex].trim();
        console.log("👉 Đang thử key:", apiKey);

        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: message }] }],
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Thành công với key:", apiKey);
            return response.data;
        } catch (error) {
            lastError = error;
            const status = error.response?.status;

            console.warn(`❌ Key ${apiKey} lỗi với status ${status}`);

            if (status === 429) {

                currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
                continue;
            } else {
                throw error;
            }
        }
    }


    throw lastError;
};

export default { callGeminiApi };
