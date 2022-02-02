import {model, Schema} from 'mongoose';

export interface IPhoto {
    _id?: string,
    title?: string,
    url?: string,
    date?: string,
    description?: string,
    isVisible?: boolean,
    photoShoot?: string
}

const photoSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isVisible: {
        type: Boolean,
        required: true
    },
    photoShoot: {
        type: Schema.Types.ObjectId,
        ref: 'photo-shoot',
        required: true
    }
})

const photos = model<IPhoto>('photo', photoSchema)

export default photos
