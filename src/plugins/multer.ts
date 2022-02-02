import multer from 'multer'
import { Request } from "express";
import path from "path";

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        const ext = file.originalname.split('.').pop()
        callback(null, `${Date.now()}.${ext}`)
    }
})

export default multer({storage})