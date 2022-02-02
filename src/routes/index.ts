import { Router, IRouter } from 'express'
import userRouter from './userRouter';
import authRouter from './authRouter';
import photoRouter from './photoRouter';
import photoShootRouter from "./photoShootRouter";
const router:IRouter = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/photo', photoRouter)
router.use('/photo-shoot', photoShootRouter)

export default router
