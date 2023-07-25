import express from "express";
import { addBooking, 
        getAllBooking,
        getTrips,
        getReservations } from '../controllers/bookingController.js'

const router = express.Router()


router.post('/addBooking', addBooking)
router.get('/allBookings', getAllBooking)
router.get('/trips', getTrips)
router.get('/reservations', getReservations)



export default router