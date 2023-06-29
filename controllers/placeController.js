import mongoose from "mongoose"
import placeModel from '../models/placeModel.js'
import cloudinary from 'cloudinary';


export const createPlace = async (req, res) => {
    const newPost = new placeModel(req.body)
    try {
        await newPost.save()
        res.status(201).json({data: newPost})
    } catch (error) {
        res.status(409).json({message: error.message})
    }

}

export const getAllPlaces = async (req, res) => {
    try {
        const places = await placeModel.find().populate('owner')
        res.status(200).json({data: places})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const removePlace = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_KEY_SECRET
      })
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No post with that ID')
    } 
    try {
        const place = await placeModel.findById(req.params.id)
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
        const deletedPost = await placeModel.findByIdAndDelete(req.params.id)
        res.status(200).json({data: deletedPost})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
} 

export const setUnavailableDates = async (req, res) => {
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //     return res.status(404).send('No post with that ID')
    // }
    try {
        const place = await placeModel.findById(req.params.id)
        req.body.timestamps.forEach(timestamp => {
            place.unavailableDates.push(timestamp);
          })
        const updatedPlace = await placeModel.findByIdAndUpdate(req.params.id, place, {new: true})
        res.status(200).json({data: updatedPlace})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// export const getUserPlaces = async (req, res) => {
//     try {
//         const userPlaces = await placeModel.find({owner : req.body.owner})
//         res.status(200).json({data:userPlaces})
//     } catch (error) {
//         res.status(500).json({message: 'Something went wrong!'})
//     }
// }
