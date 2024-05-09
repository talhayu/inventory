const User = require('../../../../model/index').user;
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const jwtSecret = require('../../../../config/jwtConfig/jwtconfig')
const cookies = require('cookies-parser')
const auth = {}


auth.register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const existingUser = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return ApiResponse(res, 400, { status: false, msg: 'Email already exist', data: null })
        }
        const newUser = await User.create(req.body);
        const { password, ...rest } = newUser._doc
        return ApiResponse(res, 200, { status: true, msg: 'User created Succesfully and verification email has been sent', data: rest })
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }

}

auth.login = async (req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findOne({ email: req.body.email })
         
        if (!findUser ||req.body.password!==findUser.password  ) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid credentials', data: null })
        }
        const { password, ...rest } = findUser._doc

        const payload = {_id: findUser._id, name: findUser.name, role: findUser.role, isVerified:  findUser.isVerified, email: findUser.email}
        const token = jwt?.sign(payload, jwtSecret.secret, {expiresIn: jwtSecret.expiresIn} )
        return   ApiResponse(res, 200, { status: true, msg: 'User succesfully login', data: rest, token })
    }catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

auth.profile = async (req, res)=>{
    res.send('ho')
}

module.exports = auth