import jwt from 'jsonwebtoken'


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({message: "Unauthenticated"})
        }
        let decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodedData?.id            
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
          }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


export default authMiddleware