import express from "express";
import { addPlace, 
        getAllPlaces,
        removePlace,
        setUnavailableDates,
        editPlace,
        getUserPlaces, 
        favoritePlace,
        getFavoritePlaces,
        reviewPlace,
        getPlace,
        getPlacesBySearch} from "../controllers/placeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()



router.post('/addPlace', authMiddleware, addPlace)
router.get('/allPlaces', getAllPlaces)

router.get('/getPlace/:placeID', getPlace)
router.get('/search', getPlacesBySearch)




router.delete('/removePlace/:placeID', authMiddleware, removePlace)



router.patch('/editPlace/:placeID', authMiddleware, editPlace)



router.patch('/unavailableDates/:placeID', authMiddleware, setUnavailableDates)
router.get('/userPlaces', authMiddleware, getUserPlaces)



router.patch('/favoritePlace/:placeID', authMiddleware, favoritePlace) 
router.get('/getFavoritePlaces',authMiddleware, getFavoritePlaces)
router.post('/reviewPlace/:placeID', authMiddleware, reviewPlace)





export default router