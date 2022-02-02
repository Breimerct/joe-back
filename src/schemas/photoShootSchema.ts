import {model, Schema} from 'mongoose';
import {IPhoto} from "./photoSchema";

export interface IPhotoShoot {
    _id?: string,
    title?: string,
    date?: string,
    description?: string,
    location?: string,
    photos?: IPhoto[]
}

const photoShootSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: true
    }
})

const photoShoots = model<IPhotoShoot>('photo-shoot', photoShootSchema)

export default photoShoots
