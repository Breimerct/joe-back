import bcrypt from 'bcrypt';
import {Types} from 'mongoose';

export const encryptPass = async (pass: string): Promise<string> => {
    return await bcrypt.hash(pass, 15)
}

export const verifyPass = async (pass: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(pass, hash)
}

export const validateId = (id: string): void => {
    if (!Types.ObjectId.isValid(id)) {
        throw { code: 400, message: `Invalid id '${id}'` }
    }
}

export const isUndefined = (val: any) => {
    return val === undefined
}
