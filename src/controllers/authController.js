const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body

        //Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //create a new user in database
        const newUser = new User({ username, password: hashPassword, role })
        await newUser.save()
        res.status(201).json({
            msg: `User registered with username ${username}`
        })
    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password} = req.body
        const user = await User.findOne({ username })

        //validate if user exists
        if (!user) {
            return res.status(404).json({
                msg: `User with username ${username} not found`
            })
        }

        //decrypt password 
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                msg: `Invalid credentials`,
            })
        }

        //Creating token JWT to User
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
        
        res.status(200).json({
            token 
        })

    } catch (error) {
        res.status(500).json({
            msg: "Something went wrong"
        })
    }

}

module.exports = {
    register,
    login
}