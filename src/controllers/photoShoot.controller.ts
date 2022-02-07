import {Request, Response} from "express";
import photoShoots, {IPhotoShoot} from "../schemas/photoShootSchema";
import photos, {IPhoto} from "../schemas/photoSchema";
import {isUndefined, validateId} from "../utils/util";

export const getPhotoShoots = async (req: Request, res: Response) => {
    try {
        let totalItems = await photoShoots.count()
        const photoShootList: IPhotoShoot[] = await photoShoots.find().select({__v: 0})
        let data: IPhotoShoot[] = []

        for (const photoShoot of photoShootList) {
            const photoList: IPhoto[] = await photos.find({photoShoot: photoShoot._id}).select({__v: 0})
            data.push({
                _id: photoShoot._id,
                title: photoShoot.title,
                description: photoShoot.description,
                date: photoShoot.location,
                location: photoShoot.date,
                photos: photoList
            })
        }
        res.send({
            totalItems,
            photoShootList: data,
            status: 200
        })
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const getPhotoShootById = async (req: Request, res: Response) => {
    const { photoShootId } = req.params
    try {
        validateId(photoShootId)
        const photoShoot: IPhotoShoot = await photoShoots.findById(photoShootId).select({__v: 0}) as IPhotoShoot
        if (photoShoot) {
            res.send(photoShoot)
        } else {
            throw {
                message: "Photo shoot not found",
                status : 404,
                photoShootId
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const createPhotoShoot = async (req: Request, res: Response) => {
    const {title, description, date, location} = req.body

    try {
        const photoShoot: IPhotoShoot = await photoShoots.create({
            title: title.toString().toLocaleLowerCase(),
            description: description.toString().toLocaleLowerCase(),
            date: date.toString().toLocaleLowerCase(),
            location: location.toString().toLocaleLowerCase()
        })
        if (photoShoot) {
            throw {
                message: "Photo created successfully",
                status: 200
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}

export const updatePhotoShoot = async (req: Request, res: Response): Promise<void> => {
    const {photoShootId} = req.params
    const {title, description, date, location} = req.body as IPhotoShoot
    try {
        validateId(photoShootId)
        const photoShoot = await photoShoots.findById(photoShootId)
            .select({
                __v: 0
            })
        if (photoShoot) {
            photoShoot.title = isUndefined(title) ? photoShoot.title : title
            photoShoot.description = isUndefined(description) ? photoShoot.description : description
            photoShoot.location = isUndefined(location) ? photoShoot.location : location
            photoShoot.date = isUndefined(date) ? photoShoot.date : date
            await photoShoot.save()
            res.send({
                photoShoot: photoShoot,
                status: 200
            })
        } else {
            throw {
                message: "photo not found",
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

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
    const {photoShootId} = req.params
    try {
        validateId(photoShootId)
        const photoShoot = await photoShoots.findByIdAndDelete(photoShootId).select({__v: 0})
        if (photoShoot) {
            res.send({
                message: "Photo shoot deleted"
            })
        } else {
            throw {
                message: "Photo shoot not found",
                status : 404
            }
        }
    } catch (e: any) {
        res.status(e.status || 500).send({
            status: e.status ? e.status : 500,
            message: e.message ? e.message : e,
        })
    }
}