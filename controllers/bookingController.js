import bookingModel from "../models/bookingModel.js"


export const addBooking = async (req, res) => {
    const newBooking = new bookingModel(req.body)
    try {
        await newBooking.save()
        await newBooking.populate('place').execPopulate();
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


export const getTrips = async (req, res) => {
    // const token = req.headers.authorization.split(" ")[1]
    // let decodedData = jwt.verify(token, process.env.JWT_SECRET)
    try {
        const bookings = await bookingModel.find({user: req.userId})
        .populate('place').sort({ checkIn: 1 })


        const now = Date.now();
        const { futureBookings, pastBookings } = bookings.reduce(
          (acc, booking) => {

            const checkOutDate = new Date(parseInt(booking.checkOut)); 
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999); 


            if (checkOutDate > endOfToday) {
              acc.futureBookings.push(booking);
            } else {
              acc.pastBookings.push(booking);
            }
            return acc;
          },
          { futureBookings: [], pastBookings: [] }
        )
        res.status(200).json({data: {futureBookings, pastBookings} })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const getBookingsOnProperties = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate('place').sort({ checkIn: 1 })
        const now = Date.now();
        const { futureBookings, pastBookings } = bookings.reduce(
          (acc, booking) => {
            if (String(booking.place.owner) === req.userId) {
              if (booking.checkOut > now) {
                acc.futureBookings.push(booking);
              } else {
                acc.pastBookings.push(booking);
              }
            }
            return acc;
          },
          { futureBookings: [], pastBookings: [] }
        )
        res.status(200).json({data: {futureBookings, pastBookings} })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}