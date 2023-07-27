import mongoose from "mongoose"



const bookingSchema = mongoose.Schema({
    user: { type:mongoose.Schema.Types.ObjectId, required: true, ref:'auth'},
    place: { type:mongoose.Schema.Types.ObjectId, required: true, ref:'place'},
    name: { type: String, required: true},
    phone: { type: String, required: true}, 
    guests: { type: String, required: true},
    price: { type: String, required: true},
    numberOfNights: { type: String, required: true},
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true}
    },
    { timestamps: true }
)

const bookingModel = mongoose.model('booking', bookingSchema)

export default bookingModel;