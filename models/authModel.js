import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    username: {required: true, type: String},
    email: {required: true, type: String}, 
    password: { type: String}, 
    picture: { type: String },
    verified: { type: Boolean, default: false},
    // places: { type: [mongoose.Schema.Types.ObjectId], ref:'place' },
    // bookings: { type: [mongoose.Schema.Types.ObjectId], ref:'booking' },

}, {
    timestamps: true
  })


const authModel = mongoose.model('auth', authSchema)

export default authModel