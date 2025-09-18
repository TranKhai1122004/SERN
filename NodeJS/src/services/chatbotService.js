import chatbotApi from "../utils/chatbotApi.js";

let getChatbotReply = async (message) => {
    const data = await chatbotApi.callGeminiApi(message);

    const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

    return reply;
};

module.exports = {
    getChatbotReply,
};
