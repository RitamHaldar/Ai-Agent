import { tavily } from "@tavily/core"

const tvly = new tavily({
    apiKey: process.env.TAVILY_API_KEY
})

export async function webSearch({ query }) {
    const response = await tvly.search(query, {
        max_results: 2
    })
    return `Here are the search results go through them thoroughly and answer the question correctly also give priority to the dates the recent date should be given more priority: ${JSON.stringify(response.results)}`
}