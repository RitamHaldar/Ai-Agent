import { PDFParse } from "pdf-parse";

/**
 * @description Read PDF Service
 * @param {string} pdfurl
 * @returns {Promise<string>}
 */

export async function readPDF(pdfurl) {
    const parser = new PDFParse({ url: pdfurl });

    const result = await parser.getText();
    return `Here is the content of the pdf go through it thoroughly and answer the question correctly: ${result.text}`;
}