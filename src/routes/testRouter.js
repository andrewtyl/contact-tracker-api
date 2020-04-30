"use strict";

const base64 = require("base-64");
const express = require("express");
const jsonBodyParser = express.json();
const testRouter = express.Router();
const bcrypt = require('bcrypt')
const encrypt = require('../helpers/encrypt')
const aes256 = require('aes256');

testRouter
  .get("/", (req, res) => {
    return res.status(200).json({
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
    });
  })
  .get("/hashTest", (req, res) => {
    const password = "defaultPassword1!";
    if (password.length >= 8) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hashedPass) {
          if (err !== undefined) {
            res.status(500).json({
              error: "Password encryption issue. Please try again.",
              errorMessage: err,
            });
          } else {
            res.status(200).json({ salt, hashedPass });
          }
        });
      });
    } else {
      res.status(400).json({
        error: "Password does not meet minimum requirement.",
        errorMessage: `Password length was ${password.length}`,
      });
    }
  })

  .get("/saltTest", (req, res) => {
    const password = "abcdefghijklmnop";
    if (password.length >= 8) {
      const salt = "$2b$10$wvsg.z9Dv1NQ2KU2tivEgO";
      bcrypt.hash(password, salt, function (err, hashedPass) {
        console.log(err);
        console.log(hashedPass);
        if (err !== undefined) {
          res.status(500).json({
            error: "Password encryption issue. Please try again.",
            errorMessage: err,
          });
        } else {
          res.status(200).json({ salt, hashedPass });
        }
      });
    } else {
      res.status(400).json({
        error: "Password does not meet minimum requirement.",
        errorMessage: `Password length was ${password.length}`,
      });
    }
  })
  .get("/genPassword", (req, res) => {
    let p1 = new Promise((resolve, reject) => {
      encrypt.createPassword(resolve, reject);
    });
    p1.then((encrypt_res) => {
      console.log(encrypt_res);
      console.log(typeof encrypt_res);
      res.status(500).json(encrypt_res);
    });
  })

  .get("/knexTest", (req, res) => {
    const knexInstance = req.app.get("knexInstance");
    knexInstance
      .from("knex_test_table")
      .timeout(10000, { cancel: true })
      .then((knexRes) => {
        return res.status(200).json("Knex connection working properly");
      })
      .catch((knexRes) => {
        return res.status(500).json({
          error: "Knex Connection Failed",
          errorMessage: knexRes,
        });
      });
  })

  .get("/genSalt", (req, res) => {
    let genSalt = encrypt.genSalt();
    return res.status(200).json(genSalt);
  })
  .get("/aesTest", (req, res) => {
    const ares_encrypted = aes256.encrypt("yeet", "dab")
    const ares_decrypted = aes256.decrypt("yeet", ares_encrypted)
    return res.status(200).json({
      to_be_encrypted: "yeet", encrypttion_key: "dab", ares_encrypted, ares_decrypted
    })
  })

module.exports = testRouter;
