import express from "express";
import { createPlace, 
        getAllPlaces,
        removePlace,
        setUnavailableDates,
        editPlace,
        getUserPlaces, 
        favoritePlace,
        getFavoritePlaces,
        reviewPlace,
        getPlace} from "../controllers/placeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/addPlace', createPlace)
router.get('/allPlaces', getAllPlaces)
router.get('/getPlace/:id', getPlace)
router.delete('/removePlace/:id', removePlace)
router.patch('/unavailableDates/:id', setUnavailableDates)
router.put('/editPlace/:id', editPlace)
router.get('/userPlaces', getUserPlaces)

router.patch('/favoritePlace/:id', authMiddleware, favoritePlace) 
router.get('/getFavoritePlaces',authMiddleware, getFavoritePlaces)

router.post('/reviewPlace/:id', authMiddleware, reviewPlace)


export default router