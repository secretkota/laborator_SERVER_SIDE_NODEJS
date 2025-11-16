import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as User from '../model/userModel.js'
import * as UserError from '../errors/UserError.js'
import { AppError } from '../errors/appError.js'
import asyncWrapper from '../middleware/asyncWrapper.js'




export const Register = asyncWrapper(async (req, res) => {
    const { username, name, password, email } = req.body

    if (!username || username.trim() === "") throw new UserError.InvalidError('Имя не должно быть пустым', 400)
    if (!name || name.trim() === "") throw new UserError.InvalidError('Логин не должен быть пустым', 400)
    if (!password || password.length < 8) throw new UserError.InvalidError('Пароль должен быть от 8 символов', 400)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) throw new UserError.InvalidError('Некорректный email', 400)



    const existUser = await User.getByLogin(username)
    if (existUser) throw new UserError.ConflictError()

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await User.register({ username, name, password: hashPassword, email })
    res.status(201).json({ success: true, userId: newUser.id })

    throw new AppError('Internal server error', 500)
})


export const Login = asyncWrapper(async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.login({ username, password })
        if (!user) throw new UserError.InvalidError('Incorrect name or password', 400)
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) throw new UserError.InvalidError('Incorrect name or password', 400)
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                username: user.username,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        )

        res.json({ token })
    }
    catch (error) {
        throw new AppError('Internal server error', 500)
    }
})

