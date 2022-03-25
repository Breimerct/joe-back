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
                throw {
                    message: "password incorrect",
                    status : 401
                }
            }
        } else {
            throw {
                user: user,
                message: "User not found",
                status : 404
            }
        }
    } catch (e: any) {
        res.status(e.status || 500)
            .send({
                status: e.status ? e.status : 500,
                message: e.message ? e.message : e,
            })
    }
}

export const getUserLogged = async (req: Request, res: Response) => {
    const { _id } = req.session
    const { token } = req.headers
    try {
        const user = await  users.findById(_id, { __v: 0, password: 0 })

        if (user) {
            res.status(200).send({
                token: token,
                user
            })
        } else {
            throw {
                userId: _id,
                message: "User not found",
                status : 404
            }
        }
    }catch (e: any) {
        res.status(e.status || 500)
            .send({
                status: e.status ? e.status : 500,
                message: e.message ? e.message : e,
            })
    }
}
