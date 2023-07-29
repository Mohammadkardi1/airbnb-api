import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import placeRouters from './routes/placeRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express() 
dotenv.config()



// middlewares
app.use(cors({
    credentials: true,
    origin: 'https://airbnb-clinet.vercel.app/'
}))
app.use(cookieParser())
app.use(express.json())

const PORT = process.env.PORT || 5000 
const CONNECTION_URL = process.env.MONGO



app.use('/api/auth', authRoutes)
app.use('/api/place', placeRouters)
app.use('/api/booking', bookingRoutes)



mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => {
        console.log(error.message)
    })


mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})