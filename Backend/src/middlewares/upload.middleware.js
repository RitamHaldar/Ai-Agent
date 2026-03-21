import Multer from "multer";

const storage = Multer.memoryStorage()
const upload = Multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    }
})

export default upload