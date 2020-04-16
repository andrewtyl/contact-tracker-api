'use strict';

const knex = require('knex')

const auth = {

    usernameTaken: (resolve, reject, req, username) => {
        const knexInstance = req.app.get('knexInstance')
        knexInstance.from('user_list').where({ user_username: username }).timeout(1000, { cancel: true }).then(knexRes => {
            if (knexRes[0] === undefined) { resolve(false) }
            else if (knexRes[0].user_username === username) { reject(true) }
            else { resolve(false) }
        })

    },

    userIsAdmin: (req, username) => {

    },

    userPassIsCorrect: (req, username, password) => {

    }

}

module.exports = auth