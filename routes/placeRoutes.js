import express from "express";
import { createPlace, 
        getAllPlaces,
        removePlace,
        setUnavailableDates,
        editPlace,
        getUserPlaces, 
        favoritePlace,
        getFavoritePlaces,
        commentPlace} from "../controllers/placeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/addPlace', createPlace)
router.get('/allPlaces', getAllPlaces)
router.delete('/removePlace/:id', removePlace)
router.patch('/unavailableDates/:id', setUnavailableDates)
router.put('/editPlace/:id', editPlace)
router.get('/userPlaces', getUserPlaces)

router.patch('/favoritePlace/:id', authMiddleware, favoritePlace) 
router.get('/getFavoritePlaces',authMiddleware, getFavoritePlaces)

router.get('/commentPlace/:id', authMiddleware, commentPlace)


export default router