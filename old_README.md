# Express Boilerplate [![Build Status](https://travis-ci.org/andrewtyl/express-boilerplate.svg?branch=master)](https://travis-ci.org/andrewtyl/express-boilerplate)
## Boilerplate

This is a boilerplate template for a new Express.js project. Additional details below.

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Open a terminal and cd to where you want the new project folder to be.
2. In terminal, run `git clone https://github.com/andrewtyl/express-boilerplate.git NEW-PROJECT-NAME ; cd NEW-PROJECT-NAME`
3. Delete `.git` folder using a file exploring program or run `rm -rf .git` in terminal. (The folder/files may be hidden from your file explorer.)
4. In terminal, run `git init ; npm i .`
5. Rename `example.env` to `.env` and configure any values you want. If you skip this step, the app will run in production mode by default.
6. If you want to use HTTPS instead of HTTP when deploying to Heroku, uncomment lines 19 and 20 on `src/app.js`
7. Edit `name`, `description`, and `repository` in `package.json`
8. Edit `version`, `author`, `keywords`, and `license` in `package.json` if needed.
9. In terminal, run `npm i --package-lock`. This will automatically update the package-lock.json file to match the edited values from package.json.
10. Edit this file to include your app's name and description. It is reccomended to keep a backup of this file before altering it and add it to `.gitignore` or to reference the readme at `https://github.com/andrewtyl/express-boilerplate/blob/master/README.md` for additional information about Scripts and Deploying.

## Scripts
* `npm start` - Starts a local server running the Express App. Any changes to files while this is running will NOT cause the server to restart.
* `npm run dev` - Starts a local server running the Express App using Nodemon. Any changes to files (except .env) while this is running will cause the server to restart.
* `npm test` - Runs all tests in `./test/`.
* `npm run predeploy` - Updates your `package-lock.json` to match `package.json`, runs all tests in `./test/`, and runs a security audit. If everything goes through properly, you should be good to deploy.

## Deployment for Heroku
Note: If you are using HTTPS, make sure your Heroku app has SSL configured properly.

1. Install the Heroku CLI using instructions from https://devcenter.heroku.com/articles/heroku-cli 
2. Create an app on Heroku. You can do this with the Heroku CLI or at https://dashboard.heroku.com/
3. Install the Travis-CI CLI using instructions from https://github.com/travis-ci/travis.rb#readme. This requires installing Ruby Version 1.9.3 or greater (2.0.0 or greater is reccomended).
4. Setup Travis-CI to automatically build pushed branches from your github repo.
5. Edit `.travis.yml`. See the file and https://docs.travis-ci.com/user/customizing-the-build for more details.
6. Any future pushes to the master branch should automatically trigger a build to Heroku.


###### License
MIT License

Copyright 2020 AJessen and Andrew Jessen-Tyler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
