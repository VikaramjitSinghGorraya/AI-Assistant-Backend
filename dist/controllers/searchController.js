"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const brave_search_1 = require("@langchain/community/tools/brave_search");
const openai_1 = require("@langchain/openai");
const Conversation_1 = __importDefault(require("../models/Conversation"));
const llm = new openai_1.ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
});
dotenv_1.default.config();
const braveSearch = new brave_search_1.BraveSearch({
    apiKey: process.env.BRAVE_SEARCH_API_KEY,
});
const search = async (req, res) => {
    const authReq = req;
    const { question, conversationId } = req.body;
    if (!question) {
        res.status(400).json({
            message: "Please provide a question to search.",
        });
    }
    try {
        const result = await braveSearch.invoke(question);
        const answer = await llm.invoke([
            {
                role: "system",
                content: "You are a helpful assistant that summarizes search results. Include link to youtube videos if any and show thr thumbnail and play btton.",
            },
            { role: "user", content: `Summarize this:\n\n${JSON.stringify(result)}` },
        ]);
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
        res.json({
            answer,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while processing your search request.",
        });
        return;
    }
};
exports.search = search;
