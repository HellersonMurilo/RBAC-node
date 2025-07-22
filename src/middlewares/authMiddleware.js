const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization

    //capturando o token que vem do authorization
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                msg: "No token, authorization denied"
            })
        }

        try {

            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode

            console.log("The decoded user is: ", req.user)

            next()
        } catch (error) {
            res.status(400).json({
                msg: "Token is not valid"
            })
        }
    } else {
        return res.status(401).json({
            msg: "No token, authorization denied"
        })
    }
}

module.exports = verifyToken