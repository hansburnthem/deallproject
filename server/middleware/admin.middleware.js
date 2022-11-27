const { PrismaClient, Prisma, Role } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const User = require('../model/User')
/**
 * Admin Middleware
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
module.exports = async (req, res, next) => {
    const user = new User(await prisma.user.findUniqueOrThrow({
        where: {
            id: req.userId
        },
        select: {
            role: true
        }
    }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
        res
            .status(400)
            .json({msg: err.message})
    }))
    if(user.role !== Role.Admin) {
        res
            .status(401)
            .json({msg: "Not Authorized"})
        return
    }
    next()
}