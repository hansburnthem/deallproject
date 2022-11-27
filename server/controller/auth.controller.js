const express = require('express')
const dayjs = require('dayjs')
const { PrismaClient, Role, Prisma } = require('@prisma/client')
const logger = require('../logger/Logger')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const User = require('../model/User')


module.exports = {
    /**
     * Login Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    login: async (req, res) => {
        const user = new User(await prisma.user.findUniqueOrThrow({
            where: {
                email: req.body.email
            },
            include: {
                auth: true
            }
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg: err.message})
        }))
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res
                .status(400)
                .json({msg: "invalid email or password"})
        }

        let auth = {
            refreshToken: uuidv4(),
            refreshTokenExpirationDate: dayjs().add(process.env.JWT_REFRESH_EXPIRATION, 'second').format('YYYY-MM-DDTHH:mm:ss') + 'Z',
            user: {
                connect: {
                    id: user.id
                }
            }
        }

        let jwtToken = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRETKEY, {
            expiresIn: 120
        })

        if(user.auth !== null) {
            await prisma.auth.update({
                where: {
                    id: user.auth.id
                },
                data: {
                    refreshToken: uuidv4(),
                    refreshTokenExpirationDate: dayjs().add(process.env.JWT_REFRESH_EXPIRATION, 'second').format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                    updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
                }
            }).then((result) => {
                res
                    .status(200)
                    .json({
                        msg: "Sucess Login",
                        accessToken: jwtToken,
                        refreshToken: result.refreshToken
                    })
            }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
                res
                    .status(400)
                    .json({msg: err.message})
            })
        }else{
            await prisma.auth.create({
                data: auth
            }).then((result) => {
                res
                    .status(200)
                    .json({
                        msg: "Sucess",
                        accessToken: jwtToken,
                        refreshToken: result.refreshToken
                    })
            }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
                logger.error(err.message)
                res
                    .status(500)
                    .json({msg:err.message})
            })
        }
    },
    /**
     * Register Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    register: async (req, res) => {
        await prisma.user.create({
            data: {
                name: req.body.name,
                password: bcrypt.hashSync(req.body.password, 10),
                email: req.body.email
            }
        }).then(() => {
            res
                .status(200)
                .json({ msg: 'Success Register' })
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            logger.error(err.message)
            res
                .status(500)
                .json({msg: err.message})
        })
    },
    /**
     * Logout Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    logout: async (req, res) => {
        await prisma.auth.delete({
            where: {
                refreshToken: req.body.refreshToken
            }
        }).then(() => {
            res
                .status(200)
                .json({ msg: 'Success Logout' })
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            logger.error(err.message)
            res
                .status(500)
                .json({msg: err.message})
        })
    },
    /**
     * RefreshToken Controller
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    refresh: async (req, res) => {
        await prisma.auth.update({
            where: {
                refreshToken: req.body.refreshToken
            },
            data: {
                refreshToken: uuidv4(),
                refreshTokenExpirationDate: dayjs().add(process.env.JWT_REFRESH_EXPIRATION, 'second').format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
            },
            include: {
                user: true
            }
        }).then((result) => {
            let jwtToken = jwt.sign({
                id: result.user.id
            }, process.env.JWT_SECRETKEY, {
                expiresIn: 120
            })
            res
                .status(200)
                .json({
                    msg: "Sucess",
                    jwtToken: jwtToken,
                    refreshToken: result.refreshToken
                })
        }).catch(/** @param {Prisma.PrismaClientKnownRequestError} err */(err) => {
            res
                .status(400)
                .json({msg:err.message})
        })
        
    }
}