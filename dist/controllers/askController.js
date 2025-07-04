"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = void 0;
const openai_1 = require("@langchain/openai");
const dotenv_1 = __importDefault(require("dotenv"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
dotenv_1.default.config();
const llm = new openai_1.ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});
const ask = async (req, res) => {
    try {
        const authReq = req;
        const { question, conversationId } = req.body;
        if (!question) {
            res.status(400).json({
                message: "Please provide a question to ask the AI.",
            });
            return;
        }
        const answer = await llm.invoke(question);
        if (conversationId) {
            const conversationFound = await Conversation_1.default.findById(conversationId);
            conversationFound?.messages.push({ role: "user", content: question }, { role: "assistant", content: String(answer.content) });
            const updatedConversation = await conversationFound?.save();
            if (!updatedConversation) {
                res.status(400).json({
                    message: "Failed to update the conversation.",
                });
                return;
            }
        }
        if (!conversationId) {
            const conversation = new Conversation_1.default({
                userID: authReq?.auth.userId,
                title: question,
                messages: [
                    {
                        role: "user",
                        content: question,
                    },
                    {
                        role: "assistant",
                        content: answer.content,
                    },
                ],
            });
            const conversationSaved = await conversation.save();
            if (!conversationSaved) {
                res.status(400).json({
                    message: "Failed to save the conversation.",
                });
                return;
            }
        }
        res.status(200).json({
            answer,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};
exports.ask = ask;
