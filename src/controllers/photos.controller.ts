import {Request, Response} from 'express'
import photos, {IPhoto} from '../schemas/photoSchema';
import cloudinary from "../plugins/cloudinary";
import fs from 'fs-extra'
import {isUndefined, validateId} from "../utils/util";

export const getPhotos = async (req: Request, res: Response) => {
    try {
        let totalItems: number = await photos.count()
        const photoList: IPhoto[] = await photos.find()
            .select({
                __v: 0
            })

        res.send({
            totalItems,
            photoList
        })
    } catch (e: any) {
        res.send({
            status: e.statusCode ? e.statusCode : 500,
            message: e.message ? e.message : e,
        }).status(500)
    }
}

export const getPhotoById = async (req: Request, res: Response): Promise<void> => {
    const {photoId} = req.params
    try {
        validateId(photoId)
        const photo = await photos.findById(photoId).select({__v: 0})

        if (photo) {
            res.send(photo)
        } else {
            res.send({
                message: "photo not found",
                status : 404
            }).status(404)
        }
    } catch (e: any) {
        res.send({
            status: e.statusCode ? e.statusCode : 500,
            message: e.message ? e.message : e,
        }).status(500)
    }
}

export const createPhoto = async (req: Request, res: Response) => {
    const {title, description, date, isVisible, photoShootId} = JSON.parse(req.body.data)
    const {file} = req

    try {
        const photoList: number = await photos.count({ photoShoot: photoShootId })
        let newPhoto: IPhoto = {
            title: title.toString().toLocaleLowerCase(),
            description: description.toString().toLocaleLowerCase(),
            date: date.toString().toLocaleLowerCase(),
            isVisible: isVisible,
            photoShoot: photoShootId
        }

        if (photoList <= 4) {
            if (file) {
                const result = await cloudinary.uploader.upload(file.path)
                newPhoto.url = result.url
            }

            await fs.unlink(file?.path!)

            const photo: IPhoto = await photos.create(newPhoto)
            if (photo) {
                res.send({
                    message: "Photo created successfully",
                    statusCode: "Ok!",
                    status: 200
                })
            }
        } else {
            res.send({
                message: "You can only register a total of 5 photos for each photo shoots",
                statusCode: "Ok!",
                status: 401
            })
        }
    } catch (e: any) {
        res.send({
            status: e.statusCode ? e.statusCode : 500,
            message: e.message ? e.message : e,
        }).status(500)
    }
}

export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
    const {photoId} = req.params
    const {title, description, date, isVisible} = req.body as IPhoto
    try {
        validateId(photoId)
        const photo = await photos.findById(photoId)
            .select({
                __v: 0
            })
        if (photo) {
            photo.title = isUndefined(title) ? photo.title : title!.toString().toLocaleLowerCase()
            photo.description = isUndefined(description) ? photo.description : description!.toString().toLocaleLowerCase()
            photo.isVisible = isUndefined(isVisible) ? photo.isVisible : isVisible
            photo.date = date || isUndefined(date) ? photo.date : date!.toString().toLocaleLowerCase()
            await photo.save()
            res.send({
                photo: photo
            })
        } else {
            res.send({
                message: "photo not found",
                status: 404
            }).status(404)
        }
    } catch (e: any) {
        res.send({
            status: e.statusCode ? e.statusCode : 500,
            message: e.message ? e.message : e,
        }).status(500)
    }
}

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
    const {photoId} = req.params
    try {
        validateId(photoId)
        const photo = await photos.findByIdAndDelete(photoId).select({__v: 0})
        if (photo) {
            res.send({
                status : "Ok!",
                message: "Photo deleted"
            })
        } else {
            res.send({
                message: "Photo not found",
                status : 404
            }).status(404)
        }
    } catch (e: any) {
        res.send({
            message: e.message || e
        }).status(e.code || 500)
    }
}
