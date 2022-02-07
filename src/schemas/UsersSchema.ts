import { Schema, model } from 'mongoose'

export interface IUser {
    _id: string
    user?: string,
    name?: string,
    lastname?: string,
    fullName?: string,
    email?: string,
    password?: string
}

const userSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const users = model<IUser>('user', userSchema)

export default users
