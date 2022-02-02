import { Router, IRouter } from 'express'
import * as User from '../controllers/user.controller'
import {verifyToken} from '../middleware/authMiddleware';
const router:IRouter = Router()

router.get("", verifyToken, User.getUser)
router.get("/:userId", verifyToken, User.getUserById)
router.post('/create', User.createUser)
router.put("/update/:userId", verifyToken, User.updateUser)
router.put("/update-password", verifyToken, User.updatePassword)
router.delete("/delete/:userId", verifyToken, User.deleteUser)

export default router
