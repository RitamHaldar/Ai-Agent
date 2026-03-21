import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage, HumanMessage, AIMessage, tool } from "langchain"
import * as z from "zod"
import { webSearch } from "./websearch.service.js"

/**
 * @description Web Search Tool
 */

const websearchtool = tool(
    webSearch,
    {
        name: "websearch",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The query to search on the web")
        })
    }
)

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
})
const model2 = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

/**
 * @description Generate Response
 * @param {Array<Object>} messages
 * @returns {Promise<string>}
 */

export async function generateResponse(messages) {
    const response = await model2.invoke(messages.map((message) => {
        if (message.role === "user") {
            return new HumanMessage(message.content)
        } else {
            return new AIMessage(message.content)
        }
    }));
    return response.text;
}

/**
 * @description Generate Title
 * @param {string} message
 * @returns {Promise<string>}
 */

export async function generateTitle(message) {
    const response = await model2.invoke([
        new SystemMessage("You are a title generator. Generate a title for the given message. Return only the title. 2-4 words. The title must be catchy and relevant to the prompt."),
        new HumanMessage(`Generate a title for a chat conversation based on the following first message: : ${message}`)
    ]);
    return response.text;
}
