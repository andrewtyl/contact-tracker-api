require('dotenv').config()
const { NODE_ENV, KNEX_CON } = require('./config')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const bcrypt = require('bcrypt')
const adminRouter = require('./routes/adminRouter')
const userRouter = require('./routes/userRouter')
const knex = require('knex')
const rstring = require('randomstring')
const encrypt = require('./helpers/encrypt')
const auth = require('./helpers/auth')
const sslRedirect = require('heroku-ssl-redirect')

let morganOption = "";
if (NODE_ENV === "development") {
    morganOption = "dev"
}
else {
    morganOption = ":date[web] - :method :url :status - :total-time[3] ms"
}

const knexConnection = knex({
    client: 'pg',
    connection: KNEX_CON,
})

app.set('knexInstance', knexConnection)

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

if (NODE_ENV === "production") {
    app.use(sslRedirect())
}

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.get('/hashTest', (req, res) => {
    const password = "tempPass";
    if (password.length >= 8) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hashedPass) {
                if (err !== undefined) {
                    res.status(500).json({ error: "Password encryption issue. Please try again.", errorMessage: err })
                }
                else {
                    res.status(200).json({ salt, hashedPass })
                }
            });
        })

    }
    else {
        res.status(400).json({
            error: "Password does not meet minimum requirement.",
            errorMessage: `Password length was ${password.length}`
        })
    }
})

app.get('/saltTest', (req, res) => {
    const password = "abcdefghijklmnop";
    if (password.length >= 8) {
        const salt = "$2b$10$wvsg.z9Dv1NQ2KU2tivEgO";
        bcrypt.hash(password, salt, function (err, hashedPass) {
            console.log(err)
            console.log(hashedPass)
            if (err !== undefined) {
                res.status(500).json({ error: "Password encryption issue. Please try again.", errorMessage: err })
            }
            else {
                res.status(200).json({ salt, hashedPass })
            }
        });
    }
    else {
        res.status(400).json({
            error: "Password does not meet minimum requirement.",
            errorMessage: `Password length was ${password.length}`
        })
    }

})

module.exports = app