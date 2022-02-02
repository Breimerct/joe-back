import {Request, Response} from 'express'
import users from '../schemas/UsersSchema';
import {verifyPass} from '../utils/util'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
    const {user, password} = req.body
    try {
        const userDB = await users.findOne({user: user!.toString().toLocaleLowerCase()}).select({__v: 0})

        if (userDB) {
            if (await verifyPass(password, userDB.password!)) {
                let payload = {
                    _id      : userDB._id,
                    name    : userDB.name,
                    lastname: userDB.lastname,
                    user    : userDB.user,
                    email   : userDB.email
                }
                const token  = jwt.sign({
                        ...payload
                    },
                    process.env.SECRET_KEY!,
                    {
                        expiresIn: 3600
                    }
                )
                res.send({
                    token: token,
                    user: payload
                })
            } else {
                res.send({
                    message: "password incorrect",
                    status : 401
                }).status(401)
            }
        } else {
            res.send({
                message: "user not found",
                status : 404
            }).status(404)
        }
    } catch (e: any) {
        res.send({
            message: e.message ? e.message : e
        }).status(500)
    }
}

export const getUserLogged = async (req: Request, res: Response) => {
    const { _id } = req.session
    try {
        const user = await  users.findById(_id, { __v: 0, password: 0 })

        if (user) {
            res.send({
                user
            }).status(200)
        } else {
            res.send({
                userId: _id,
                message: "User not found"
            }).status(404)
        }
    }catch (e: any) {
        
    }
}
