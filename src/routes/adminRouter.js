"use strict";

const base64 = require("base-64");
const express = require("express");
const jsonBodyParser = express.json();
const adminRouter = express.Router();
const encrypt = require("../helpers/encrypt");
const knex = require("knex");
const auth = require("../helpers/auth");

adminRouter
  .all(jsonBodyParser, (req, res, next) => {
    //Is user properly authenticated and an admin?
    let rawauth = req.headers.authorization;

    if (!rawauth) {
      //no auth
      res.status(403).json({
        error: "No Auth Header",
        errorMessage:
          "You are missing authentication information. Please use basic auth with your requests.",
      });
    } else if (!rawauth.startsWith("Basic")) {
      //not basic auth
      res.status(404).json({
        error: "Auth Header: Invalid Syntax",
        errorMessage: "Auth headers should use Basic Authentication.",
      });
    } else {
      rawauth = rawauth.substr(6);
      rawauth = base64.decode(rawauth);
      const userAuth = {
        username: rawauth.split(":")[0],
        plainTextPass: rawauth.split(":")[1],
      };
      const knexInstance = req.app.get("knexInstance");
      knexInstance
        .from("user_list")
        .where({ user_username: userAuth.username })
        .select("user_admin", "user_salt", "user_password")
        .timeout(10000, { cancel: true })
        .then((kres) => {
          const userInfo = kres[0];
          if (userInfo === undefined) {
            res
              .status(403)
              .json({
                error: "Unauthorized",
                errorMessage: "The username or password is incorrect.",
              });
          } else if (userInfo.user_admin) {
            const passRight = encrypt.comparePassword(
              userAuth.plainTextPass,
              userInfo.user_password,
              userInfo.user_salt
            );
            if (passRight) {
              next();
            } else {
              res
                .status(403)
                .json({
                  error: "Unauthorized",
                  errorMessage: "The username or password is incorrect.",
                });
            }
          } else {
            res
              .status(403)
              .json({
                error: "Unauthorized",
                errorMessage:
                  "You are not authorized for /admin/* privileges. Please contact another admin if this is a mistake.",
              });
          }
        }).catch(kres => {
          return res.status(500).json({
            error: "knex connection failed",
            errorMessage: kres
          })
        });
    }
  })
  .get("/", jsonBodyParser, (req, res, next) => {
    return res.status(200).json({
      message: 'Welcome to the "Contact Tracker" API app by AJessen. Please refer to the documentation at https://github.com/andrewtyl/contact-tracker-api/blob/master/README.md for more details.',
      source_code: "https://github.com/andrewtyl/contact-tracker-api",
      paths: [
        "GET /admin/ - Responds with a detailed message, including all admin routes and their usage.",
            "GET /admin/users - Responds with a list of all users, including their user id, username, and if the user is an admin or not.",
            "GET /admin/user - Similar to the /admin/users endpoint, but this one searches all users and returns with a single user. Requires the HTTP Request Query to include 'user_id', 'user_username', or both.",
            "POST /admin/user - Creates a new user. It also generates a password for them as well. Requires 'username' in the JSON request body, which should have a value of a string."
      ]
    });
  })

  .get("/users", jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("knexInstance");
    knexInstance
      .from("user_list")
      .select("user_id", "user_username", "user_admin")
      .timeout(10000, { cancel: true })
      .then((knexRes) => {
        return res.status(200).json(knexRes);
      })
      .catch((knexRes) => {
        return res.status(500).json({
          error: "Knex Connection Failed",
          errorMessage: knexRes,
        });
      });
  })

  .get("/user", jsonBodyParser, (req, res, next) => {
    const user_id = req.query.user_id;
    const user_username = req.query.user_username;

    if (user_id === undefined && user_username === undefined) {
      return res
        .status(400)
        .json({
          error: "Invalid syntax.",
          errorMessage:
            "Please include either 'user_id' or 'user_username' in your GET request query.",
        });
    } else {
      const knexInstance = req.app.get("knexInstance");
      let knexReq = {};
      if (user_id !== undefined) {
        user_id = parseInt(user_id);
        knexReq.user_id = user_id;
      }
      if (user_username !== undefined) {
        knexReq.user_username = user_username;
      }
      knexInstance
        .from("user_list")
        .where(knexReq)
        .select("user_id", "user_username", "user_admin")
        .timeout(10000, { cancel: true })
        .then((knexRes) => {
          if (knexRes[0] !== undefined) {
            return res.status(200).json(knexRes);
          } else {
            return res
              .status(404)
              .json({
                error: "User not found.",
                errorMessage:
                  "The user could not be located or does not exist. Please try again with a different user_id and/or user_username to search for.",
              });
          }
        })
        .catch((knexRes) => {
          return res.status(500).json({
            error: "Knex Connection Failed",
            errorMessage: knexRes,
          });
        });
    }
  })

  .post("/user", jsonBodyParser, (req, res, next) => {
    const username = req.body.username;

    let p1 = new Promise((resolve, reject) => {
      auth.usernameTaken(resolve, reject, req, username);
    });
    let p2 = new Promise((resolve, reject) => {
      encrypt.createPassword(resolve, reject);
    });

    Promise.all([p1, p2])
      .then((pres) => {
        if (pres[0] === true) {
          return res
            .status(409)
            .json({
              error: "Username Taken",
              errorMessage: `${username} has already been registered. Please contact an admin if you have forgotten your password and need a new one.`,
            });
        } else {
          const knexInstance = req.app.get("knexInstance");
          const plainTextPass = pres[1].plainTextPass;
          const salt = pres[1].salt;
          const hashedPass = pres[1].hashedPass;

          knexInstance
            .from("user_list")
            .insert({
              user_username: username,
              user_password: hashedPass,
              user_salt: salt,
              user_admin: false,
            })
            .timeout(10000, { cancel: true })
            .then(() => {
              return res
                .status(201)
                .json({ username, password: plainTextPass });
            })
            .catch((kres) => {
              return res
                .status(500)
                .json({
                  error:
                    "Issue posting username to DB. Please try again or contact an admin.",
                  errorMessage: kres,
                });
            });
        }
      })
      .catch((pres) => {
        if (pres[0] === true) {
          return res
            .status(409)
            .json({
              error: "Username Taken",
              errorMessage: `${username} has already been registered. Please contact an admin if you have forgotten your password and need a new one.`,
            });
        } else {
          return res
            .status(500)
            .json({
              error: "Internal Server error. Please try again",
              errorMessage: "Issue generating a password",
            });
        }
      });
  });

module.exports = adminRouter;
