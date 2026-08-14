import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai"
import { SystemMessage, HumanMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { webSearch } from "./websearch.service.js"
import { AnsFromPdf } from "./filereading.service.js"

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
 * @description Mistral AI Model
 */
const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
})



export const embedd = new MistralAIEmbeddings({
    model: "mistral-embed",
    apiKey: process.env.MISTRAL_API_KEY
})

/**
 * @description Stream Response

 * @param {Array<Object>} messages
 * @param {Function} onChunk
 * @returns {Promise<string>}
 */

export async function streamResponse(messages, onChunk, userId,chatId) {
    let buffer = "";
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
    const Pdfandtool = tool(
        async ({query}) => await AnsFromPdf(query,userId,chatId),
        {
            name: "pdfcontentstool",
            description: "Use this tool to get the information from the uploaded pdf files.",
            schema: z.object({
                query: z.string().describe("The query to search on the pdf content")
            })
        }
    )
    const agent = createAgent({
        model,
        tools: [websearchtool, Pdfandtool]
    })
    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If the user's question relates to uploaded documents, PDFs, or files, or if answering the question requires context from previously uploaded PDFs, ALWAYS use the "pdfcontentstool" tool first to search and retrieve information from the PDF content.
                If the question requires up-to-date information from the internet, use the "websearch" tool and then answer based on the search results.
                If you don't know the answer after checking the tools, say you don't know.
                If the User asks about email writing, generate an email draft.
                You MUST follow this exact structure for drafts:
                "Here’s a professional and informative email draft about **[Topic]** that you can send to **[Email]**:

                ---

                **Subject:** [Subject Line]

                Dear [Name],

                [Body Content]

                Best regards,
                [Your Name]"
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

