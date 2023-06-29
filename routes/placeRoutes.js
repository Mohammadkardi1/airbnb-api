import express from "express";
import { createPlace, 
        getAllPlaces,
        removePlace,
        setUnavailableDates } from "../controllers/placeController.js";


const router = express.Router()

router.post('/addPlace', createPlace)
router.get('/allPlaces', getAllPlaces)
router.delete('/removePlace/:id', removePlace)
router.patch('/unavailableDates/:id', setUnavailableDates)


// router.get('/userPlaces', getUserPlaces)

export default router