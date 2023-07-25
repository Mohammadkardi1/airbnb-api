import mongoose from "mongoose"; 

const tokenSchema = mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "auth", unique: true,},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 10 }, // 1 Hour
})


const tokenModel = mongoose.model('token', tokenSchema)

export default tokenModel
