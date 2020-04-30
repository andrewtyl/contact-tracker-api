# Contact Tracker (API) [![Build Status](https://travis-ci.com/andrewtyl/contact-tracker-api.svg?branch=master)](https://travis-ci.com/andrewtyl/contact-tracker-api)
## Andrew Jessen-Tyler

### Overview
This Express App is used for storing contacts securely in a PostgreSQL server. I made this app just as a simple skills demonstration for my portfolio.

It uses AES256 encryption to store all the contact information, and bases it's key off of the user's password so even admins can't see them. Due to this encryption, it does trade off with efficiency. But due to the small scale nature of this app, this doesn't seem to be much of an issue. The Express App also uses HTTPS and will enforce connections to use it.

If you want to try this yourself, you will need an admin to manually register you. Contact ajessen@ajessen.com if you are interested. You can still try the open routes at https://contacts-api.ajessen.com/ until a user is generated for you.

Please note that the live app is set to auto sleep (to save money) and you may see an error page if no requests have been made in the last 30 minutes. Retry your request in 10-15 seconds and it should be up and running.


### Paths

#### Route

- GET / - Responds with a detailed message, including all routes and their usage.

#### /test/

- GET /test/ - Responds with a detailed message, including all test routes and their usage.

- GET /test/hashTest - A remnant of my testing for other routes. You can send a request here to test out the bcrypt hash method. I recommend reading the source code for this path. (./src/routes/testRouter.js)

- GET /test/saltTest - A remnant of my testing for other routes. You can send a request here to test out the bcrypt hash + custom salting method. I recommend reading the source code for this path. (./src/routes/testRouter.js)

- GET /test/genPassword - Generates a random password for use with the program. The response includes the plain text password, the hashed password, and the salt. Everything an admin would need to change a password for an existing user. I mainly use this to change the password for the super user in the database.

- GET /test/knexTest - Triggers a connection test between the API and the PostgreSQL server.

- GET /test/genSalt - Sometimes I needed to have a salt pregenerated (so I use the same salt each time) in the hard code, such as for the "thisSessionKey" used to encrypt user's contacts. So that's what this is for. It simply uses bcrypt to generate a salt compatible with it.

- GET /test/aesTest - Yet another remnant of my testing for other routes. Just shows how aes256 encryption works. It did help show me that the encrypting the same text and key still makes a different encrypted string each time, but will always be decryptable with the right key regardless.

#### /admin/

NOTE: Admin endpoints require basic authentication and the user must be marked as an admin in the database.

- GET /admin/ - Responds with a detailed message, including all admin routes and their usage.

- GET /admin/users - Responds with a list of all users, including their user id, username, and if the user is an admin or not.

- GET /admin/user - Similar to the /admin/users endpoint, but this one searches all users and returns with a single user. Requires the HTTP Request Query to include "user_id", "user_username", or both.

- POST /admin/user - Creates a new user. It also generates a password for them as well. Requires "username" in the JSON request body, which should have a value of a string.

#### /user/

NOTE: User endpoints require basic authentication.

- GET /user/ - Responds with a detailed message, including all user routes and their usage.

- GET /user/contacts - Responds with the all contacts owned by the user.

- GET /user/contact - Similar to the /user/contacts endpoint, but this one searches all users and returns with a single contact. Requires the HTTP Request Query to include one or more keys or values matching the contact you are trying to search for. See POST /user/contact for more information.

- GET /user/contact/:contact_id - Just like the /user/contact endpoint, but this one is used if you already know the contact ID. So if you are searching for contact id "7", you would make a GET request to /user/contact/7 . No query or body is required with this endpoint.

- POST /user/contact - Posts a new contact to the database under the logged in user. Requires at least one contact storage key and value in the JSON request body. Accepted contact storage fields listed below (and they all use string values).
    - contact_first_name
	- contact_last_name
	- contact_phone_no
	- contact_phone_type
	- contact_phone2_no
	- contact_phone2_type
	- contact_phone3_no
	- contact_phone3_type
	- contact_email
    - contact_email_type
	- contact_email2
    - contact_email2_type
	- contact_email3
    - contact_email3_type
	- contact_company
	- contact_company_title
	- contact_address_street
	- contact_address_apt
	- contact_address_city
	- contact_address_state
	- contact_address_zip
	- contact_address_type
	- contact_address_country
	- contact_address2_street
	- contact_address2_apt
	- contact_address2_city
	- contact_address2_state
	- contact_address2_zip
    - contact_address2_type
	- contact_address3_street
	- contact_address3_apt
	- contact_address3_city
	- contact_address3_state
	- contact_address3_zip
	- contact_address3_country
	- contact_address3_type
	- contact_skype
	- contact_discord
	- contact_twitter
	- contact_website
	- contact_birthday
	- contact_relationship
	- contact_notes

- PATCH /user/contact/:contact_id - Allows you to update contact information. Requires one or more of the fields from "POST /user/contact" in the JSON request body. Also requires the contact ID in the url/parameters. For example, if you are trying to access contact 7, make your request to /contact/7 .


### Future Updates
- Users will be able to change their passwords (currently, admins are only able to issue passwords, which does give a security vulnerability as there is no way in v1.0 for users to change their passwords themselves.)


### Changelog
- 4/29/2020 - V1.0 Released. The app is now functional for use.


###### License
MIT License

Copyright 2020 AJessen and Andrew Jessen-Tyler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
