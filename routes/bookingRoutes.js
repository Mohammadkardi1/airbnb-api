import express from "express";
import { addBooking, 
        getAllBooking,
        getTrips,
        getBookingsOnProperties } from '../controllers/bookingController.js'
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router()


router.post('/addBooking', authMiddleware , addBooking)
router.get('/allBookings', authMiddleware, getAllBooking)
router.get('/trips', authMiddleware, getTrips)
router.get('/bookingsOnProperties', authMiddleware, getBookingsOnProperties)



export default router