import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as User from '../model/userModel.js';




export const Register = async (req, res) => {
    const { name, password, email } = req.body

    if (!name || name.trim() === "") return res.status(400).json({ message: "Имя не должно быть пустым" })
    if (!password || password.length < 6) return res.status(400).json({ message: "Пароль должен быть от 6 символов" })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) return res.status(400).json({ message: "Некорректный email" })


    try {
        const existUser = await User.getByLogin(name)
        if (existUser) return res.status(409).json({message: "User was registred"})
        
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.register({name, password: hashPassword, email})
        res.status(201).json({success: true, userId: newUser.id})

    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}


export const Login = async (req, res) => {
    const {name, password} = req.body

    try {
        const user = await User.login({name, password})
        if (!user) return res.status(401).json({message: "Неверное имя или пароль"})
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(401).json({message: "Неверное имя или пароль"})
        const token = jwt.sign(
            { 
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        )

        res.json({token})
    }
    catch (error) {
        res.status(500).json({ error: error.message})
    }
}

