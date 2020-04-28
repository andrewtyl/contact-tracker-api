"use strict";

const base64 = require("base-64");
const express = require("express");
const jsonBodyParser = express.json();
const userRouter = express.Router();
const encrypt = require("../helpers/encrypt");
const knex = require("knex");
const auth = require("../helpers/auth");
const aes256 = require("aes256");
const { adminKey } = require("../config");
let thisSessionKey = "";
let currentUsername = "";
let user_id = null;

userRouter
  .all(jsonBodyParser, (req, res, next) => {
    let rawauth = req.headers.authorization;

    if (rawauth === undefined) {
      //no auth
      return res
        .status(403)
        .json({
          error: "Unauthorized",
          errorMessage:
            "No authorization was provided. Please include a Basic Authentication Header in your HTTP request.",
        });
    } else if (!rawauth.startsWith("Basic")) {
      return res
        .status(404)
        .json({
          error: "Invalid Authorization Header",
          errorMessage:
            "Please use a Basic Authentication Header in your HTTP request.",
        });
    } else {
      rawauth = rawauth.substr(6);
      rawauth = base64.decode(rawauth);
      const userAuth = {
        username: rawauth.split(":")[0],
        plainTextPass: rawauth.split(":")[1],
      };
      currentUsername = userAuth.username;
      const knexInstance = req.app.get("knexInstance");
      knexInstance
        .from("user_list")
        .where({ user_username: userAuth.username })
        .select("user_salt", "user_password", "user_id")
        .then((kres) => {
          const userInfo = kres[0];
          if (userInfo === undefined) {
            return res
              .status(403)
              .json({
                error: "Unauthorized",
                errorMessage: "The username or password is incorrect.",
              });
          } else {
            const passRight = encrypt.comparePassword(
              userAuth.plainTextPass,
              userInfo.user_password,
              userInfo.user_salt
            );
            if (passRight) {
              const userkey =
                (userAuth.plainTextPass, userInfo.user_salt) + "0000";
              thisSessionKey = (encrypt.hashPassword(
                adminKey + userkey,
                "$2b$10$.Jryq1VpUrV5GE82OvmVTu"
              ).hashedPass);
              user_id = kres[0].user_id
              next();
            } else {
              return res
                .status(403)
                .json({
                  error: "Unauthorized",
                  errorMessage: "The username or password is incorrect.",
                });
            }
          }
        })
        .catch((kres) => {
          return res
            .status(500)
            .json({
              error:
                "Could not retrieve user info from database with knex. Please try again later or contact an admin.",
              errorMessage: kres,
            });
        });
    }
  })
  .get("/", jsonBodyParser, (req, res, next) => {
    //methods description and syntax
    return res.status(500).json("In Development");
  })
  .patch("/changePassword", jsonBodyParser, (req, res, next) => {
    //if no new password is provided, generate one
    let createPassword = null;
    let newPassword = req.body.newPassword;
    if (
      newPassword === undefined ||
      newPassword === null ||
      newPassword === "" ||
      !newPassword
    ) {
      createPassword = true;
      newPassword = "";
    } else {
      createPassword = false;
    }

    if (typeof newPassword !== "string") {
      return res
        .status(400)
        .json({
          error: "Invalid password format",
          errorMessage:
            "Your new password should be a string between 8 and 24 characters.",
        });
    } else if (
      newPassword.length > 24 ||
      (newPassword.length < 8 && createPassword === false)
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid password format",
          errorMessage:
            "Your new password should be a string between 8 and 24 characters.",
        });
    } else {
      let p1 = new Promise((resolve, reject) => {
        //only use if createPassword is true
        encrypt.createPassword(resolve, reject);
      });
      let p2 = new Promise((resolve, reject) => {
        const salt = encrypt.genSalt();
        let thisresponse = encrypt.hashPassword(newPassword, salt);
        resolve({ hashedPass: thisresponse.hashedPass, salt });
      });

      let updatePassword = (newPlainTextPass, newHashedPass, newSalt) => {};
      if (createPassword) {
        p1.then((p1res) => {
          console.log("p1res inc");
          console.log(p1res);
        });
      } else {
        p2.then((p2res) => {
          console.log("p2res inc");
          console.log(p2res);
        });
      }

      return res.status(500).json("In Development");
    }
  })
  .get("/contacts", jsonBodyParser, (req, res, next) => {
    return res.status(500).json("In Development");
  })
  .get("/contact", jsonBodyParser, (req, res, next) => {
    return res.status(500).json("In Development");
  })
  .post("/contact", jsonBodyParser, (req, res, next) => {
      console.log(req.body)
      let keys = Object.keys(req.body)
      let values = Object.values(req.body)
      for (let i=0; i < values.length; i++) {
          if (values[i].length > 200) {
              return res.status(400).json({
                  error: "Overfill error",
                  errorMessage: `The ${keys[i]} value is over 200 characters. Please shorten it and then retry your request.`
              })
          }
      }
      let knexPost = req.body;

      Object.keys(knexPost).forEach(key => {
          knexPost[key] = aes256.encrypt(thisSessionKey, knexPost[key])
      })
      knexPost.user_id = user_id;
      if (knexPost.key) {knexPost.key = aes256.encrypt(thisSessionKey, knexPost.key)}
      const knexInstance = req.app.get("knexInstance");
      knexInstance('contact_list').insert(knexPost).then( kres => {
        return res.status(201).json(req.body)
      }
      ).catch(
          kres => {
              return res.status(500).json({
                  error:"Knex Connection Failed",
                  errorMessage: kres
              })
          }
      )
  })

  .patch("/contact", jsonBodyParser, (req, res, next) => {
    return res.status(500).json("In Development");
  })
  .get("/backupContacts", jsonBodyParser, (req, res, next) => {
    return res.status(500).json("In Development");
  })
  .post("/backupContacts", jsonBodyParser, (req, res, next) => {
    return res.status(500).json("In Development");
  });

module.exports = userRouter;

//Use AES 256 encryption to encrypt/decrypt the contact info.

//const plaintext = contact info;
//const encrypted = aes256.encrypt(thisSessionKey, plaintext);
//const decrypted = aes256.decrypt(thisSessionKey, encrypted);
