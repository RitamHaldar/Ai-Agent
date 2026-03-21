import ImageKit, { toFile } from "@imagekit/nodejs";

/**
 * @description ImageKit Instance
 */
const imagekit = new ImageKit({
    privateKey: process.env.IMAGE_KIT_KEY
})

/**
 * @description Upload PDF Service
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */

export async function uploadPDF(file) {
    const response = await imagekit.files.upload({
        file: await toFile(Buffer.from(file.buffer)),
        fileName: file.originalname,
        folder: "pdfs"
    })
    return response.url
}
