import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import indexRoutes from './routes'
import path from 'path';

//settings
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const app = express()
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }) )
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

//Routes
app.use('/api', indexRoutes)
app.use('/uploads', express.static(path.resolve('uploads')))

export default app
