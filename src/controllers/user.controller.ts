import {Request, Response} from 'express'
import users, {IUser} from '../schemas/UsersSchema';
import {verifyPass, encryptPass, validateId, isUndefined} from '../utils/util'

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalItems = await users.count()
        const userList: IUser[] = await users.find().select({password: 0, __v: 0})
        res.send({
            totalItems,
            userList
        })
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.params
    try {
        validateId(userId)
        const user = await users.findById(userId).select({password: 0, __v: 0})

        if (user) {
            res.send(user)
        } else {
            throw {
                message: "user not found",
                status: 404,
                userId: user
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

export const createUser = async (req: Request, res: Response) => {
    const {user, name, lastname, email, password} = req.body
    try {
        const successfullyCreateUser = await users.create({
            user: user.toString().toLocaleLowerCase(),
            name: name.toString().toLocaleLowerCase(),
            lastname: lastname.toString().toLocaleLowerCase(),
            fullName: `${name.toString().toLocaleLowerCase()} ${lastname.toString().toLocaleLowerCase()}`,
            email: email.toString().toLocaleLowerCase(),
            password: await encryptPass(password)
        })
        if (successfullyCreateUser) {
            res.status(200).send({
                message: "User created successfully",
                status: 200
            })
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.params
    const {name, lastname, email} = req.body
    try {
        validateId(userId)
        const user = await users.findById(userId)
            .select({
                password: 0,
                __v: 0
            })
        if (user) {
            user.name = isUndefined(name) ? user.name : name.toString().toLocaleLowerCase()
            user.lastname = isUndefined(lastname) ? user.lastname : lastname.toString().toLocaleLowerCase()
            user.email = isUndefined(email) ? user.email : email.toString().toLocaleLowerCase()

            await user.save()

            res.send({
                user: user
            })
        } else {
            throw {
                userId,
                message: "user not found",
                status: 404
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    const {_id} = req.session
    const {newPassword, oldPassword} = req.body
    try {
        validateId(_id!)
        const user = await users.findById(_id)
        if (user) {
            if (await verifyPass(oldPassword, user.password!)) {
                user.password = await encryptPass(newPassword) || user.password
                await users.updateOne({_id: _id}, user)
                res.send({
                    status: 200,
                    message: "password updated successfully"
                })
            } else {
                throw {
                    message: "old password does not match",
                    status: 401
                }
            }
        } else {
            throw {
                message: "user not found",
                status: 404,
                userId: _id
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.params
    try {
        validateId(userId)
        const user = await users.findByIdAndDelete(userId).select({password: 0, __v: 0})
        if (user) {
            res.send({
                status: "Ok!",
                message: "user deleted"
            })
        } else {
            throw {
                message: "user not found",
                status: 404,
                userId
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}
