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
const testRouter = require('./routes/testRouter')
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
app.use('/test', testRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

module.exports = app