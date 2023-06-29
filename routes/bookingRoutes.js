import express from "express";
import { addBooking, 
        getAllBooking,
        getUserBookings } from '../controllers/bookingController.js'

const router = express.Router()


router.post('/addBooking', addBooking)
router.get('/allBookings', getAllBooking)
router.get('/userBookings', getUserBookings)




export default router