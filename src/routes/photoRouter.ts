import { Router, IRouter } from 'express'
import * as Photo from '../controllers/photos.controller'
import { verifyToken } from '../middleware/authMiddleware';
import multer from "../plugins/multer";
const router:IRouter = Router()

router.get("", Photo.getPhotos)
router.get("/:photoId", verifyToken, Photo.getPhotoById)
router.post('/create', verifyToken, multer.single('file'), Photo.createPhoto)
router.put("/update/:photoId", verifyToken, Photo.updatePhoto)
router.delete("/delete/:photoId", verifyToken, Photo.deletePhoto)

export default router
