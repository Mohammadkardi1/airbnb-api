import authModel from '../models/authModel.js'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import crypto from 'crypto' 
import tokenModel from '../models/token.js'
import sendEmail from '../utils/sendEmail.js'


export const register = async (req, res) => {
    const {username, email, password} = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({message: 'All fields must be filled.'})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({message: 'Email is not valid.'})
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: 'Password is not strong enough.'})
        }
        if (!validator.isAlphanumeric(username, 'en-US', {ignore: ' '})) {
            return res.status(400).json({message: 'Username must be alphanumeric.'})
        }
        const existingUser = await authModel.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: 'Email is already registered. Please log in.'})
        }


        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)


        const newUser = await authModel.create({username, email, password: hashPassword})


		const verifiedToken = await tokenModel.create({
			userId: newUser._id,
			token: crypto.randomBytes(32).toString("hex"),
		})


        const url = `${process.env.BASE_URL}/api/auth/${newUser._id}/verify/${verifiedToken.token}`;
		await sendEmail(
                newUser.email, 
                "Account Verification", 
                `<div>Hi ${newUser.username},</div>
                <br>
                <div>
                    Please Click on the link to verify your email address:${url}
                </div>`,)
		res.status(400).send({ message: "To complete your registration, please check your email for a verification link." });

    } catch (error) {
        res.status(400).json({message: 'Someting went wrong! Try again.'})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({message: 'All fields must be filled.'})
        }


        const existingUser = await authModel.findOne({email})
        if (!existingUser) {
            return res.status(400).json({message: "User not found! Please Sign up."})
        }



        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Wrong password! Try again."})
        }


		if (!existingUser.verified) {   
			// let token = await tokenModel.findOne({ userId: existingUser._id });
			// if (!token) {
            //     const verifiedToken = await tokenModel.create({
            //         userId: existingUser._id,
            //         token: crypto.randomBytes(32).toString("hex"),
            //     })

            //     const url = `${process.env.BASE_URL}/api/auth/${existingUser._id}/verify/${verifiedToken.token}`;
            //     await sendEmail(
            //             existingUser.email, 
            //             "Account Verification", 
            //             `<div>Hi ${existingUser.username},</div>
            //             <br>
            //             <div>
            //                 Please Click on the link to verify your email address:${url}
            //             </div>`,
            //             )
            // }
			return res.status(400).send({ message: "Your account has not verified yet. Please check your email for a verification link." });
        }

        const token = jwt.sign(
            {id: existingUser._id}, 
            process.env.JWT_SECRET
            ,{expiresIn: '23h'}
            )
        res.status(200).json({...existingUser._doc, token})
    } catch (error) {
        res.status(400).json({message: 'Someting went wrong! Try again.'})
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const existingUser = await authModel.findOne({ _id: req.params.id })
        if (!existingUser) {
            return res.status(400).send({ message: "Invalid link" })
        }
        const existingToken = await tokenModel.findOne({
            userId: existingUser._id,
            token: req.params.token,
        })
        if (!existingToken) {
            return res.status(400).send({ message: "Invalid link" })
        }

        await authModel.findByIdAndUpdate(existingUser._id, {verified: true })
        await tokenModel.findByIdAndDelete(existingToken._id)
        res.status(200).send({ message: "Email verified successfully! Please Log in." });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export const resendVerification = async (req, res) => {
    const email = req.query.email
    try {
        const existingUser = await authModel.findOne({email})
        if (!existingUser.verified) {   
            let existingToken = await tokenModel.findOne({ userId: existingUser._id })
            if (!existingToken) {
                existingToken = await tokenModel.create({
                    userId: existingUser._id,
                    token: crypto.randomBytes(32).toString("hex"),
                })
            }
            const url = `${process.env.BASE_URL}/api/auth/${existingUser._id}/verify/${existingToken.token}`;
            await sendEmail(
                    existingUser.email, 
                    "Account Verification", 
                    `<div>Hi ${existingUser.username},</div>
                    <br>
                    <div>
                        Please Click on the link to verify your email address:${url}
                    </div>`,)
            return res.status(200).send({ message: "The verification link is sent again. Please check your email." })
        }
        return res.status(400).send({ message: "The account is already verified." })
    } catch (error) {
        res.status(400).json({message: 'Someting went wrong! Try again.'})
    }
}


export const googleLogin = async (req, res) => {
    const {username, email, picture } = req.body
    try {
        const existingUser = await authModel.findOne({email})

        if (existingUser) {
            const token = jwt.sign(
                {id: existingUser._id}, 
                process.env.JWT_SECRET
                ,{expiresIn: '24h'}
                )
            return res.status(200).json({...existingUser._doc, token})
        } else {
            const newUser = await authModel.create({username, email, picture, verified: true})
            const token = jwt.sign(
                {id: newUser._id}, 
                process.env.JWT_SECRET
                ,{expiresIn: '24h'}
                )
            return res.status(200).json({...newUser._doc, token})  
        }
    } catch (error) {
        res.status(400).json({message: 'Someting went wrong! Try again.'})
    }
}

