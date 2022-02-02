import { Router, IRouter } from 'express'
import * as Auth from '../controllers/auth.controller'
import {verifyToken} from "../middleware/authMiddleware";
const router:IRouter = Router()

router.post("/login", Auth.login)
router.get("/user", verifyToken, Auth.getUserLogged)

export default router
