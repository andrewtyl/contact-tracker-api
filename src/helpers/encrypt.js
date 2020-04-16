'use strict';

const rstring = require('randomstring')
const bcrypt = require('bcrypt')

const encrypt = {

    createPassword: (resolve, reject) => { //used for registering new users
        const plainTextPass = rstring.generate({length: 12, charset: 'alphanumeric', readable: true})
        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(plainTextPass, salt)
        resolve({plainTextPass, salt, hashedPass})
    },

    hashPassword: (plainTextPass, salt) => {
        const hashedPass = bcrypt.hashSync(plainTextPass, salt)
        return {hashedPass}
    },

    comparePassword: (plainTextPass, hashedPass, salt) => {
        const hashedPass2 = encrypt.hashPassword(plainTextPass, salt).hashedPass
        console.log(hashedPass2)
        console.log(hashedPass)
        return (hashedPass === hashedPass2);
    }

}

module.exports = encrypt