const app = require('../src/app')

describe('App.js', () => {
  it('GET / responds with 200 and the proper JSON body', () => {
    return supertest(app)
      .get('/')
      .expect(200, {
        message: 'Welcome to the "Contact Tracker" API app by AJessen. Please refer to the documentation at https://github.com/andrewtyl/contact-tracker-api/blob/master/README.md for more details.',
        source_code: "https://github.com/andrewtyl/contact-tracker-api",
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
})

describe('testRouter.js', () => {
  it('GET /test/ responds with 200 and the proper JSON body', () => {
    return supertest(app)
    .get('/test/')
    .expect(200, {
      message: 'Welcome to the "Contact Tracker" API app by AJessen. Please refer to the documentation at https://github.com/andrewtyl/contact-tracker-api/blob/master/README.md for more details.',
      source_code: "https://github.com/andrewtyl/contact-tracker-api",
      paths: [
        "GET /test/ - Responds with a detailed message, including all test routes and their usage.",
            "GET /test/saltTest - A remnant of my testing for other routes. You can send a request here to test out the bcrypt hash + custom salting method. I recommend reading the source code for this path. (./src/routes/testRouter.js)",
            "GET /test/genPassword - Generates a random password for use with the program. The response includes the plain text password, the hashed password, and the salt. Everything an admin would need to change a password for an existing user. I mainly use this to change the password for the super user in the database.",
            "GET /test/knexTest - Triggers a connection test between the API and the PostgreSQL server.",
            "GET /test/genSalt - Sometimes I needed to have a salt pregenerated (so I use the same salt each time) in the hard code, such as for the 'thisSessionKey' used to encrypt user's contacts. So that's what this is for. It simply uses bcrypt to generate a salt compatible with it.",
            "GET /test/aesTest - Yet another remnant of my testing for other routes. Just shows how aes256 encryption works. It did help show me that the encrypting the same text and key still makes a different encrypted string each time, but will always be decryptable with the right key regardless."
      ]
    })
  })

  it("GET /test/hashTest responds with 200 and a JSON object with keys 'salt' and 'hashedPass' with both values being strings", () => {
    return supertest(app)
    .get('/test/hashTest')
    .expect(200)
    .expect((res) => {
       let keyTest = (Object.keys(res.body) === ['salt', 'hashedPass'])
       let valueTestParts = []
       let values = Object.values(res.body)
       values.forEach(value => {
         valueTestParts.push(typeof value === "string")
       })
       let valuesTest = true;
       valueTestParts.forEach(x => {
         if (x === false) {
           valuesTest = false
         }
       })
       return (valuesTest && keyTest)
    })
  })

  it("GET /test/saltTest responds with 200 and a JSON object with keys 'salt' and 'hashedPass' with both values being strings", () => {
    return supertest(app)
    .get('/test/hashTest')
    .expect(200)
    .expect((res) => {
       let keyTest = (Object.keys(res.body) === ['salt', 'hashedPass'])
       let valueTestParts = []
       let values = Object.values(res.body)
       values.forEach(value => {
         valueTestParts.push(typeof value === "string")
       })
       let valuesTest = true;
       valueTestParts.forEach(x => {
         if (x === false) {
           valuesTest = false
         }
       })
       return (valuesTest && keyTest)
    })
  })

  it("GET /test/genPassword responds with 200 and a JSON object with keys ['plainTextPass', 'salt', hashedPass'] with all values being strings", () => {
    return supertest(app)
    .get('/test/genPassword')
    .expect(200)
    .expect((res) => {
       let keyTest = (Object.keys(res.body) === ['plainTextPass', 'salt', 'hashedPass'])
       let valueTestParts = []
       let values = Object.values(res.body)
       values.forEach(value => {
         valueTestParts.push(typeof value === "string")
       })
       let valuesTest = true;
       valueTestParts.forEach(x => {
         if (x === false) {
           valuesTest = false
         }
       })
       return (valuesTest && keyTest)
    })
  })

  it("GET /test/genSalt responds with 200 and a string", () => {
    return supertest(app)
    .get('/test/genSalt')
    .expect(200)
    .expect((res) => {
      return (typeof res === "string")
    })
  })

  it("GET /test/aesTest responds with 200 and a JSON object with keys ['to_be_encrypted', 'encryption_key', 'ares_encrypted', 'ares_decrypted'] with the expected values", () => {
    return supertest(app)
    .get('/test/aesTest')
    .expect(200)
    .expect((res) => {
      let keyTest = (Object.keys(res.body) === ['to_be_encrypted', 'encryption_key', 'ares_encrypted', 'ares_decrypted'])

      let valuesTest = []

      valuesTest.push(res.body.to_be_encrypted === "yeet")
      valuesTest.push(res.body.encryption_key === "dab")
      valuesTest.push(typeof res.body.ares_encrypted === "string")
      valuesTest.push(res.body.ares_decrypted === "yeet")

      let pass = keyTest

      valuesTest.forEach(x => {
        if (x === false) {
          pass = false
        }
      })

      return pass

    })
  })

  it("GET /text/knexTest responds with 200", () => {
    return supertest(app)
    .get('/test/knexTest')
    .expect(200)
  })

})