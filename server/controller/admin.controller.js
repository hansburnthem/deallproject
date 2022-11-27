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
    readAll: async (req, res) => {
        await prisma.user.findMany({
            where: {
                id: {
                    not: req.userId
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        }).then((result) => {
            if(result.length === 0){
                res
                .status(200)
                .json({msg: "No Data"})
            }else{
                res
                .status(200)
                .json({data: result})
            }
            
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg: err.message})
        })
    },
    /**
     * Get User
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    readById: async (req, res) => {
        await prisma.user.findUniqueOrThrow({
            where: {
                id: req.params.id
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
    },
    /**
     * Get User
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    update: async (req, res) => {
        await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: req.body,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        }).then((result) => {
            res
                .status(200)
                .json({msg: "success update", data: result})
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg: err.message})
        })
    },
    /**
     * Get User
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    delete: async (req, res) => {
        await prisma.user.delete({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res
                .status(200)
                .json({msg: "success delete"})
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg: err.message})
        })
    }
     
}