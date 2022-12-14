const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
    },
    age: {
        type: Number,
        required: [true, 'Please provide age'],
        min: 13,
    },
    region: {
        type: String,
        default: 'Nigeria',
    },
})

AuthSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

AuthSchema.methods.createJWT = function() {
    return jwt.sign({ id: this._id, user: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_DURATION,
    })
}

AuthSchema.methods.checkPassword = async function(password) {
    console.log(password, this.password)
    const checker = await bcrypt.compare(password, this.password)
    return checker
}

module.exports = mongoose.model('Auth', AuthSchema)