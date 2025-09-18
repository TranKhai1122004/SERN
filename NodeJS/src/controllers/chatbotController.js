import chatbotService from "../services/chatbotService"
let handleChatbotMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ errCode: 1, errMessage: "Message is required" });
        }

        const reply = await chatbotService.getChatbotReply(message);
        return res.status(200).json({ errCode: 0, reply });
    } catch (e) {
        console.error("Chatbot error:", e);
        return res.status(500).json({ errCode: -1, reply: "Có lỗi khi gọi API." });
    }
};

module.exports = {
    handleChatbotMessage,
};
