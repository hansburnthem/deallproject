const { PrismaClient, Role, Prisma } = require('@prisma/client')
const express = require('express')
const prisma = new PrismaClient()

module.exports = {
    /**
     * Get All User
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    read: async (req, res) => {
        await prisma.user.findUniqueOrThrow({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        }).then((result) => {
            res
                .status(200)
                .json({data: result})
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg: err.message})
        })
    }
}