import {Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {IUser} from '../schemas/UsersSchema';

declare global {
    namespace Express {
        export interface Request {
            session: IUser
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const {token} = req.headers
        if (!token) {
            throw new Error("missing header token")
        }
        const {_id, email} = jwt.verify(token as string, process.env.SECRET_KEY!) as IUser
        req.session = {
            _id: _id,
            email: email
        }
        next()
    } catch (e: any) {
        res.send({
            message: e.message.replace('jwt', 'Token')
        }).status(500)
    }
}
