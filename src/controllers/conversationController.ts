import { Request, Response } from "express";
import Conversation from "../models/Conversation";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
  };
}

export const getConversations = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const userID = authReq.auth.userId;

    const conversations = await Conversation.find({ userID }).sort({
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
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while fetching conversations.",
    });
    return;
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;

    const conversation = await Conversation.findOneAndDelete({
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
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while deleting the conversation.",
    });
    return;
  }
};
