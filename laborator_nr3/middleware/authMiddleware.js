import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    const authInfo = req.headers.authorization
    if (!authInfo) return res.status(401).json({error: "401 not authorizon"})
    
    const token = authInfo.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({message: "Неверный токен"})
        req.user = user
        next()
    })
}