import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    latlng: {
      type: [Number],
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
  })

const placeSchema = mongoose.Schema({
    // owner: {type: mongoose.Schema.Types.ObjectId, ref:'auth'},
    owner: { type: mongoose.Schema.Types.ObjectId,required: true , ref: 'auth'},
    title: { type: String },
    address: { type: String },
    photos: [{
        public_id: {type: String},
        url: {type: String},
    }],
    description: { type: String },
    perks: {type: [String]}, 
    extraInfo: {type: String},
    maxGuests: {type: Number},
    rooms: {type: Number},
    bathrooms: {type: Number},

    price: { type: Number },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'booking' }],
    category: {type: String},
    location: locationSchema,

    unavailableDates: {type: [String]}
})

const placeModel = mongoose.model('place', placeSchema)

export default placeModel