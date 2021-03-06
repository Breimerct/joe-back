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
            photoList,
            status: 200
        })
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
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
            throw {
                message: "photo not found",
                status : 404,
                photoId
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const createPhoto = async (req: Request, res: Response) => {
    const data = JSON.parse(req.body.data)
    const {file} = req

    try {
        if (data.photoShootId) {
            const response = await createPhotoWithPhotoShootId(file, data)
            res.send(response)
        } else {
            const response = await createPhotoWithOutPhotoShootId(file, data)
            res.send(response)
        }

    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
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
                photo: photo,
                status: 200
            })
        } else {
            throw {
                message: "photo not found",
                status: 404,
                photoId
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
    const {photoId} = req.params
    try {
        validateId(photoId)
        const photo = await photos.findByIdAndDelete(photoId).select({__v: 0})
        if (photo) {
            res.send({
                message: "Photo deleted",
                status: 200
            })
        } else {
            throw {
                message: "Photo not found",
                status : 404,
                photoId
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

//este metodo est?? para registrar una foto con el id de una sesi??n
const createPhotoWithPhotoShootId = (file: any, data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const photoList: number = await photos.count({ photoShoot: data.photoShootId })
            let newPhoto: IPhoto = {
                title: data.title.toString().toLocaleLowerCase(),
                description: data.description.toString().toLocaleLowerCase(),
                date: data.date.toString().toLocaleLowerCase(),
                isVisible: data.isVisible,
                photoShoot: data.photoShootId
            }

            if (photoList <= 4) {
                if (file) {
                    const result = await cloudinary.uploader.upload(file.path)
                    newPhoto.url = result.url
                }

                await fs.unlink(file?.path!)

                const photo: IPhoto = await photos.create(newPhoto)
                if (photo) {
                    resolve({
                        message: "Photo created successfully",
                        status: 200
                    })
                }
            } else {
                reject({
                    message: "You can only register a total of 5 photos for each photo shoots",
                    status: 401
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

//este metodo est?? para registrar una foto sin el ID de una sesi??n
const createPhotoWithOutPhotoShootId = (file: any, data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newPhoto: IPhoto = {
                title: data.title.toString().toLocaleLowerCase(),
                description: data.description.toString().toLocaleLowerCase(),
                date: data.date.toString().toLocaleLowerCase(),
                isVisible: data.isVisible
            }

            if (file) {
                const result = await cloudinary.uploader.upload(file.path)
                newPhoto.url = result.url
            }

            await fs.unlink(file?.path!)

            const photo: IPhoto = await photos.create(newPhoto)
            if (photo) {
                resolve({
                    message: "Photo created successfully",
                    status: 200
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
