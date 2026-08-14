import { PDFParse } from "pdf-parse";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { index } from "../config/pinecone.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { embedd } from "./ai.service.js";
/**
 * @description Read PDF Service
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function uploadToVectorDB(buffer, userId,chatId) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const chunks = await splitter.splitText(result.text);
    const uid = String(userId);
    const cId = String(chatId);
    const timestamp = Date.now();
    const docs = await Promise.all(chunks.map(async (chunk) => {
        const embeddings = await embedd.embedQuery(chunk)
        return {
            text: chunk,
            embedding: embeddings
        }
    }))
    await index.upsert({
        records: docs.map((doc, i) => {
            return {
                id: `${uid}_${timestamp}_doc_${i}`,
                values: doc.embedding,
                metadata: {
                    text: doc.text,
                    userId: uid,
                    chatId:cId
                }
            }
        })
    })
    return 'Uploaded to vector DB';
}
export async function AnsFromPdf(query, userId,chatId) {
    const uid = String(userId);
    const cId = String(chatId);
    const result = await index.query({
        vector: await embedd.embedQuery(query),
        topK: 5,
        includeMetadata: true,
        filter: {
            "userId": uid,
            "chatId": cId
        }
    })
    const retrievedText = result.matches ? result.matches.map((match) => match.metadata?.text).filter(Boolean).join("\n\n") : "";
    return retrievedText || "No relevant information found in the uploaded PDFs.";
}


export async function generateImageDescription(buffer) {
    const model = new ChatOpenAI({
        model: "stepfun-ai/step-3.7-flash",
        apiKey: process.env.NVIDIA_API_KEY,
        temperature: 0.0,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        streaming: true,
        modelKwargs: {
            enable_thinking: false, // Turn off chain-of-thought to maximize raw generation speed
        },
        configuration: {
            baseURL: "https://integrate.api.nvidia.com/v1",
            // Removed legacy httpAgent and httpsAgent to enable modern Node.js fetch with HTTP/2 and undici connection pooling
        }
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
        if (!process.env.NVIDIA_API_KEY) {
            console.error("Error: NVIDIA_API_KEY is missing in your .env file.");
        } else {
            console.error("Error generating content:", error);
        }
    }
}