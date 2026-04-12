import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage, HumanMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { webSearch } from "./websearch.service.js"
import { sendEmail } from "./autosend.service.js"

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
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})



/**
 * @description Stream Response

 * @param {Array<Object>} messages
 * @param {Function} onChunk
 * @returns {Promise<string>}
 */

export async function streamResponse(messages, onChunk, refreshToken) {
    const emailTool = tool(
        (args) => sendEmail({ ...args, refreshToken }),
        {
            name: "sendEmail",
            description: "Use this tool to send an email to the user.",
            schema: z.object({
                to: z.string().describe("The email address to send the email to"),
                subject: z.string().describe("The subject of the email"),
                html: z.string().describe("The HTML content of the email")
            })
        }
    )

    const agent = createAgent({
        model,
        tools: [websearchtool, emailTool]
    })

    let buffer = "";
    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information then only use the "websearch" tool and then answer based on the search results.
                
                Capability Status:
                - Email: ${refreshToken ? "Authenticated. You CAN send emails using the 'sendEmail' tool." : "NOT Authenticated. If the user wants to send an email, tell them they must first link their Gmail account by clicking the 'Connect Gmail' button or visiting /api/email."}
            `),

            ...messages.map((m) => {
                if (m.role === "user") return new HumanMessage(m.content + (m.additionalContent || ""));
                return new AIMessage(m.content);
            })
        ]
    },
        {
            stream: true,
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        buffer += token;
                        if (buffer.length > 60) {
                            if (onChunk) onChunk(buffer);
                            buffer = "";
                        }
                    },
                    handleLLMEnd() {
                        if (buffer.length > 0) {
                            if (onChunk) onChunk(buffer);
                            buffer = "";
                        }
                    }
                }
            ]
        });

    return response.messages[response.messages.length - 1].text;
}






/**
 * @description Generate Title
 * @param {string} message
 * @returns {Promise<string>}
 */

export async function generateTitle(message) {
    const response = await model.invoke([
        new SystemMessage("You are a title generator. Generate a title for the given message. Return only the title. 2-4 words. The title must be catchy and relevant to the prompt give plain text no quotes or special characters like \" \' \*."),
        new HumanMessage(`Generate a title for a chat conversation based on the following first message: : ${message}`)
    ]);
    const title = response.text.replace(/"/g, "").replace(/'/g, "").replace(/\*/g, "").trim();
    return title;
}

