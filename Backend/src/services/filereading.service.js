import { PDFParse } from "pdf-parse";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
/**
 * @description Read PDF Service
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */

export async function readPDF(buffer) {
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();
    return `Here is the content of the pdf go through it thoroughly and answer the question correctly: ${result.text.slice(0, 10000)}`;
}


export async function generateImageDescription(buffer) {
    const model = new ChatGroq({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        apiKey: process.env.GROQ_API_KEY,
    });

    const base64Image = buffer.toString("base64");
    const message = new HumanMessage({
        content: [
            {
                type: "text",
                text: "describe this image with key details.",
            },
            {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                },
            },
        ],
    });
    try {
        const res = await model.invoke([message]);
        return `Here is the description of the image ans any questions related to it and dont add any thanks for explaining or any thing: ${res.content}`;
    } catch (error) {
        if (!process.env.GROQ_API_KEY) {
            console.error("Error: GROQ_API_KEY is missing in your .env file.");
        } else {
            console.error("Error generating content:", error);
        }
    }
}