import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage, HumanMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { webSearch } from "./websearch.service.js"


export async function registerIO(io) {
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("message", async (message) => {
            console.log("Message from user", message);
            socket.emit("message", "Message from server");
        })
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        })
    })
}



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

/**
 * @description Mistral AI Model
 */

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const agent = createAgent({
    model,
    tools: [websearchtool]
})

/**
 * @description Generate Response
 * @param {Array<Object>} messages
 * @returns {Promise<string>}
 */

/**
 * @description Stream Response

 * @param {Array<Object>} messages
 * @param {Function} onChunk
 * @returns {Promise<string>}
 */

export async function streamResponse(messages, onChunk) {
    const stream = await agent.stream({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information then only use the "websearch" tool and then answer based on the search results.
            `),
            ...messages.map((m) => {
                if (m.role === "user") return new HumanMessage(m.content);
                return new AIMessage(m.content);
            })
        ]
    },
        {
            streamMode: "updates",
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        if (onChunk) onChunk(token);
                    }
                }
            ]
        });

    let fullResponse = "";
    for await (const chunk of stream) {
        const nodeOutput = chunk.agent || chunk.generate || Object.values(chunk)[0];
        const msg = nodeOutput?.messages?.[nodeOutput.messages.length - 1];

        if (msg && (msg._getType && msg._getType() === "ai" || msg.role === "ai")) {
            const content = msg.content;
            if (content) {
                fullResponse = content;
            }
        }
    }
    return fullResponse;
}





/**
 * @description Generate Title
 * @param {string} message
 * @returns {Promise<string>}
 */

export async function generateTitle(message) {
    const response = await model.invoke([
        new SystemMessage("You are a title generator. Generate a title for the given message. Return only the title. 2-4 words. The title must be catchy and relevant to the prompt."),
        new HumanMessage(`Generate a title for a chat conversation based on the following first message: : ${message}`)
    ]);
    return response.text;
}
