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

app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/test', testRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the "Contact Tracker" API app by AJessen. Please refer to the documentation at https://github.com/andrewtyl/contact-tracker-api/blob/master/README.md for more details.',
        paths: [
            "GET / - Responds with a detailed message, including all routes and their usage.",
            "GET /test/ - Responds with a detailed message, including all test routes and their usage.",
            "GET /test/saltTest - A remnant of my testing for other routes. You can send a request here to test out the bcrypt hash + custom salting method. I recommend reading the source code for this path. (./src/routes/testRouter.js)",
            "GET /test/genPassword - Generates a random password for use with the program. The response includes the plain text password, the hashed password, and the salt. Everything an admin would need to change a password for an existing user. I mainly use this to change the password for the super user in the database.",
            "GET /test/knexTest - Triggers a connection test between the API and the PostgreSQL server.",
            "GET /test/genSalt - Sometimes I needed to have a salt pregenerated (so I use the same salt each time) in the hard code, such as for the 'thisSessionKey' used to encrypt user's contacts. So that's what this is for. It simply uses bcrypt to generate a salt compatible with it.",
            "GET /test/aesTest - Yet another remnant of my testing for other routes. Just shows how aes256 encryption works. It did help show me that the encrypting the same text and key still makes a different encrypted string each time, but will always be decryptable with the right key regardless.",
            "GET /admin/ - Responds with a detailed message, including all admin routes and their usage.",
            "GET /admin/users - Responds with a list of all users, including their user id, username, and if the user is an admin or not.",
            "GET /admin/user - Similar to the /admin/users endpoint, but this one searches all users and returns with a single user. Requires the HTTP Request Query to include 'user_id', 'user_username', or both.",
            "POST /admin/user - Creates a new user. It also generates a password for them as well. Requires 'username' in the JSON request body, which should have a value of a string.",
            "GET /user/ - Responds with a detailed message, including all user routes and their usage.",
            "GET /user/contacts - Responds with the all contacts owned by the user.",
            "GET /user/contact - Similar to the /user/contacts endpoint, but this one searches all users and returns with a single contact. Requires the HTTP Request Query to include one or more keys or values matching the contact you are trying to search for. See POST /user/contact in the README for more information.",
            "GET /user/contact/:contact_id - Just like the /user/contact endpoint, but this one is used if you already know the contact ID. So if you are searching for contact id '7', you would make a GET request to /user/contact/7 . No query or body is required with this endpoint.",
            "POST /user/contact - Posts a new contact to the database under the logged in user. Requires at least one contact storage key and value in the JSON request body. Accepted contact storage fields listed in the README (and they all use string values).",
            "PATCH /user/contact/:contact_id - Allows you to update contact information. Requires one or more of the fields from 'POST /user/contact' in the JSON request body. Also requires the contact ID in the url/parameters. For example, if you are trying to access contact 7, make your request to /contact/7 ."
        ]
    })
})

module.exports = app