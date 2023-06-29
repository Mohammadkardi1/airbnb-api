import bookingModel from "../models/bookingModel.js"
import jwt from 'jsonwebtoken'


export const addBooking = async (req, res) => {
    const newBooking = new bookingModel(req.body)
    try {
        await newBooking.save()
        res.status(201).json({data: newBooking})
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getAllBooking = async (req, res) => {
    try {
        const allBooking = await bookingModel.find().populate('place')
        res.status(200).json({data: allBooking})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const getUserBookings = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    let decodedData = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const response = await bookingModel.find({user:decodedData.id}).populate('place')
        res.status(200).json({data: response})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}