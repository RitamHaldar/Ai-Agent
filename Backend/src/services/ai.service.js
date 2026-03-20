import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage, HumanMessage } from "@langchain/core/messages"

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
})
const model2 = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

export async function generateResponse(message) {
    const response = await model.invoke(message);
    return response.text;
}

export async function generateTitle(message) {
    const response = await model2.invoke([
        new SystemMessage("You are a title generator. Generate a title for the given prompt. Return only the title. 2-4 words. The title must be catchy and relevant to the prompt."),
        new HumanMessage(message)
    ]);
    return response.text;
}