import { Request, Response } from "express";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import Conversation from "../models/Conversation";

dotenv.config();
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

export const ask = async (req: Request, res: Response) => {
  try {
    interface AuthenticatedRequest extends Request {
      auth: {
        userId: string;
      };
    }
    const authReq = req as AuthenticatedRequest;

    const { question, conversationId } = req.body;

    if (!question) {
      res.status(400).json({
        message: "Please provide a question to ask the AI.",
      });
      return;
    }

    const answer = await llm.invoke(question);

    if (conversationId) {
      const conversationFound = await Conversation.findById(conversationId);

      conversationFound?.messages.push(
        { role: "user", content: question },
        { role: "assistant", content: String(answer.content) }
      );

      const updatedConversation = await conversationFound?.save();

      if (!updatedConversation) {
        res.status(400).json({
          message: "Failed to update the conversation.",
        });
        return;
      }
    }
    if (!conversationId) {
      const conversation = new Conversation({
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
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};
