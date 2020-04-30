# Contact Tracker (API) [![Build Status](https://travis-ci.com/andrewtyl/contact-tracker-api.svg?branch=master)](https://travis-ci.com/andrewtyl/contact-tracker-api)
## Andrew Jessen-Tyler

### Overview
This Express App is used for storing contacts securely in a PostgreSQL server. I made this app just as a simple skills demonstration for my portfolio.

It uses AES256 encryption to store all the contact information, and bases it's key off of the user's password so even admins can't see them. Due to this encryption, it does trade off with efficiency. But due to the small scale nature of this app, this doesn't seem to be much of an issue. The Express App also uses HTTPS and will enforce connections to use it.

If you want to try this yourself, you will need an admin to manually register you. Contact ajessen@ajessen.com if you are interested. You can still try the open routes at https://contacts-api.ajessen.com/ until a user is generated for you.

Please note that the live app is set to auto sleep (to save money) and will likely take some time to respond if no requests have been made in the previous 30 minutes.


### Paths



### Future Updates



### Changelog
- 4/29/2020 - V1.0 Released. The app is now functional for use.


###### License
MIT License

Copyright 2020 AJessen and Andrew Jessen-Tyler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
