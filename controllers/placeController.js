import mongoose from "mongoose"
import placeModel from '../models/placeModel.js'
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken'
import bookingModel from "../models/bookingModel.js";



export const addPlace = async (req, res) => {
    const newPost = new placeModel(req.body)
    try {
        await newPost.save()
        // await newPost.populate({
        //     path: 'reviews.user',
        //     model: 'auth'
        //   }).populate('owner').execPopulate();
        res.status(201).json({data: newPost})
    } catch (error) {
        res.status(409).json({message: error.message})
    }

}

export const getAllPlaces = async (req, res) => {
    try {
        const places = await placeModel.find().populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner').sort({ createdAt: -1 })

          
        res.status(200).json({data: places})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}



export const getPlace = async (req, res) => {
    try {
        const place = await placeModel.findById(req.params.placeID).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner')
        res.status(200).json({data: place})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}




export const getPlacesBySearch = async (req, res) => {
    const {searchQuery} = req.query


    const title = new RegExp(searchQuery, "i");
    try {
      const places = await placeModel.find({ title });
      res.status(200).json({ data: places });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve posts." });
    }
}

export const removePlace = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.placeID)) {
        return res.status(404).json({message: 'No place with that ID'})
    } 
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_KEY_SECRET
      })
    try {
        const place = await placeModel.findById(req.params.placeID)
        if (req.userId !== place.owner.toString() ) {
            return res.status(401).json({message: "Unauthorized"})
        }
        for (let i = 0; i < place.photos.length ; i++ ) {
            const imgPublicId = place.photos[i].public_id
            if (imgPublicId) {
                await cloudinary.uploader.destroy(imgPublicId, function(error, result) {
                    if (error) {
                      console.log('Error deleting image:', error);
                    } else {
                      console.log('Image deleted:', result);
                    }
                  });
            }
        }
        await bookingModel.deleteMany({ place: req.params.placeID });
        const deletedPost = await placeModel.findByIdAndDelete(req.params.placeID)
        res.status(200).json({data: deletedPost})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
} 

export const setUnavailableDates = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.placeID)) {
        return res.status(404).json({message: 'No place with that ID'})
    }
    try {
        const place = await placeModel.findById(req.params.placeID)
        req.body.timestamps.forEach(timestamp => {
            place.unavailableDates.push(timestamp);
          })
        const updatedPlace = await placeModel.findByIdAndUpdate(req.params.placeID, place, {new: true}).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner')
        res.status(200).json({data: updatedPlace})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const editPlace = async (req, res) => {
    const { placeID } = req.params
    if (!mongoose.Types.ObjectId.isValid(placeID)) {
        return res.status(404).json({message: 'No place with that ID'})
    } 

    try {
        const place = await placeModel.findById(placeID) 
        if (!place) {
            return res.status(404).json({message: 'Place not found'})
        }
        if (req.userId !== place.owner.toString() ) {
            return res.status(401).json({message: "Unauthorized"})
        }

        place.title = req.body.title || place.title
        place.location = req.body.location || place.location
        place.description = req.body.description || place.description
        place.photos = req.body.photos || place.photos
        place.perks = req.body.perks  || place.perks
        place.extraInfo = req.body.extraInfo  || place.extraInfo
        place.category = req.body.category || place.category
        place.maxGuests = req.body.maxGuests || place.maxGuests
        place.rooms = req.body.rooms || place.rooms
        place.bathrooms = req.body.bathrooms || place.bathrooms
        place.price = req.body.price || place.price


        const updatedPlace = await placeModel.findByIdAndUpdate(placeID, place, {new: true}).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner');
        
        return  res.status(200).json({data: updatedPlace})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


export const getUserPlaces = async (req, res) => {
    // const token = req.headers.authorization.split(" ")[1]
    // let decodedData = jwt.verify(token, process.env.JWT_SECRET)
    // const { id } = req.params
    try {
        const response = await placeModel.find({owner:req.userId}).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner').sort({ createdAt: -1 })
        res.status(200).json({data: response})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}



export const favoritePlace = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.placeID)) {
        return res.status(404).json({message: "No place with that ID"})
    }
    try {
        const place = await placeModel.findById(req.params.placeID)
        const index = place.favorites.findIndex((id) => id === String(req.userId))
        if (index === -1 ) {
            place.favorites.push(req.userId)
        } else {
            place.favorites = place.favorites.filter((id) => id !== String(req.userId)) 
        }
        const updatedPlace = await placeModel.findByIdAndUpdate(req.params.placeID, place, {new: true}).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner');
        res.status(200).json({data: updatedPlace})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}



export const getFavoritePlaces = async (req, res) => {
    try {
        const places = await placeModel.find({ favorites: {$in: req.userId}}).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner');
        res.status(200).json({data: places})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const reviewPlace = async (req, res) => {
    try {
        let place = await placeModel.findById(req.params.placeID)        
        place.reviews.unshift({...req.body, user: req.userId})
        const updatedPlace = await placeModel.findByIdAndUpdate(req.params.placeID, place, { new: true }).populate({
            path: 'reviews.user',
            model: 'auth'
          }).populate('owner');
        res.status(200).json({data: updatedPlace})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


// const places = await Place.find().populate({
//     path: 'reviews.user',
//     model: 'User'
//   });



// review place
// await place.save()

// place = await placeModel.findById(req.params.id).populate({
//     path: 'reviews.user',
//     model: 'auth'
//   }).populate('owner');







