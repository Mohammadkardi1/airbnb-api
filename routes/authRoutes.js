import express from "express";
import { register, login, googleLogin, verifyEmail, resendVerification } from '../controllers/authController.js'

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.post('/googleLogin', googleLogin)
router.get('/:id/verify/:token', verifyEmail)
router.get('/resendVerification', resendVerification)


export default router