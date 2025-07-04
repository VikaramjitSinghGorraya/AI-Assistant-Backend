"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.getConversations = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const getConversations = async (req, res) => {
    const authReq = req;
    try {
        const userID = authReq.auth.userId;
        const conversations = await Conversation_1.default.find({ userID }).sort({
            createdAt: -1,
        });
        if (!conversations || conversations.length === 0) {
            res.status(404).json({
                message: "No conversations found.",
            });
            return;
        }
        res.status(200).json({
            conversations,
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            message: "An error occurred while fetching conversations.",
        });
        return;
    }
};
exports.getConversations = getConversations;
const deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversation = await Conversation_1.default.findOneAndDelete({
            _id: conversationId,
        });
        if (!conversation) {
            res.status(404).json({
                message: "Conversation not found.",
            });
            return;
        }
        res.status(200).json({
            message: "Conversation deleted successfully.",
        });
        return;
    }
    catch (err) {
        res.status(500).json({
            message: "An error occurred while deleting the conversation.",
        });
        return;
    }
};
exports.deleteConversation = deleteConversation;
