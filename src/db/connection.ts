import mongoDB from 'mongoose'

const connect = async (): Promise<boolean> => {
    let mongoUri: string = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI! : 'mongodb://localhost/joe_project_db'
    try {
        await mongoDB.connect(mongoUri, {})
        return true
    }
    catch (e) {
        console.error(e)
        return false
    }
}

export default connect
