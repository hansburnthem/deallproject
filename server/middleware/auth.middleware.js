const express = require('express')
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
/**
 * Auth Middleware
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
module.exports = async (req, res, next) => {
    const jwtClient = req.header("accessToken")
    if(!jwtClient){
        return res.status(403).send({ msg: "No token provided!" })
    }

    jwt.verify(jwtClient, process.env.JWT_SECRETKEY, (err, decoded) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                // Bisa ditambahkan auto generate jwttoken with refreshtoken disini.
                return res.status(401).send({ message: "Unauthorized! Access Token was expired!" })
            }
            return res.sendStatus(401).send({ message: "Unauthorized!" })
        }
        req.userId = decoded.id
        next()
    })
}