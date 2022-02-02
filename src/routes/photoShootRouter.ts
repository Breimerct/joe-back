import { Router, IRouter } from 'express'
import {verifyToken} from "../middleware/authMiddleware";
import * as PhotoShoot from "../controllers/photoShoot.controller";
const router:IRouter = Router()

router.get("", PhotoShoot.getPhotoShoots)
router.get("/:photoShootId", verifyToken, PhotoShoot.getPhotoShootById)
router.post('/create', verifyToken, PhotoShoot.createPhotoShoot)
router.put('/update/:photoShootId', verifyToken, PhotoShoot.updatePhotoShoot)
router.delete('/delete/:photoShootId', verifyToken, PhotoShoot.deletePhoto)

export default router