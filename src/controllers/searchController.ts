import { Request, Response } from "express";
import dotenv from "dotenv";
import { BraveSearch } from "@langchain/community/tools/brave_search";
import { ChatOpenAI } from "@langchain/openai";
import Conversation from "../models/Conversation";

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

dotenv.config();
const braveSearch = new BraveSearch({
  apiKey: process.env.BRAVE_SEARCH_API_KEY,
});

export const search = async (req: Request, res: Response) => {
  interface AuthenticatedRequest extends Request {
    auth: {
      userId: string;
    };
  }
  const authReq = req as AuthenticatedRequest;

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
        content:
          "You are a helpful assistant that summarizes search results. Include link to youtube videos if any and show thr thumbnail and play btton.",
      },
      { role: "user", content: `Summarize this:\n\n${JSON.stringify(result)}` },
    ]);

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

    res.json({
      answer,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing your search request.",
    });
    return;
  }
};
