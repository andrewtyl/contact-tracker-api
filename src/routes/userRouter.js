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
      return res.status(403).json({
        error: "Unauthorized",
        errorMessage:
          "No authorization was provided. Please include a Basic Authentication Header in your HTTP request.",
      });
    } else if (!rawauth.startsWith("Basic")) {
      return res.status(404).json({
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
        .timeout(10000, { cancel: true })
        .then((kres) => {
          const userInfo = kres[0];
          if (userInfo === undefined) {
            return res.status(403).json({
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
              thisSessionKey = encrypt.hashPassword(
                adminKey + userkey,
                "$2b$10$.Jryq1VpUrV5GE82OvmVTu"
              ).hashedPass;
              user_id = kres[0].user_id;
              next();
            } else {
              return res.status(403).json({
                error: "Unauthorized",
                errorMessage: "The username or password is incorrect.",
              });
            }
          }
        })
        .catch((kres) => {
          return res.status(500).json({
            error:
              "Could not retrieve user info from database with knex. Please try again later or contact an admin.",
            errorMessage: kres,
          });
        });
    }
  })
  .get("/", jsonBodyParser, (req, res, next) => {
    return res.status(200).json({
      message: 'Welcome to the "Contact Tracker" API app by AJessen. Please refer to the documentation at https://github.com/andrewtyl/contact-tracker-api/blob/master/README.md for more details.',
      paths: [
        "GET /user/ - Responds with a detailed message, including all user routes and their usage.",
        "GET /user/contacts - Responds with the all contacts owned by the user.",
        "GET /user/contact - Similar to the /user/contacts endpoint, but this one searches all users and returns with a single contact. Requires the HTTP Request Query to include one or more keys or values matching the contact you are trying to search for. See POST /user/contact in the README for more information.",
        "GET /user/contact/:contact_id - Just like the /user/contact endpoint, but this one is used if you already know the contact ID. So if you are searching for contact id '7', you would make a GET request to /user/contact/7 . No query or body is required with this endpoint.",
        "POST /user/contact - Posts a new contact to the database under the logged in user. Requires at least one contact storage key and value in the JSON request body. Accepted contact storage fields listed in the README (and they all use string values).",
        "PATCH /user/contact/:contact_id - Allows you to update contact information. Requires one or more of the fields from 'POST /user/contact' in the JSON request body. Also requires the contact ID in the url/parameters. For example, if you are trying to access contact 7, make your request to /contact/7 ."
      ]
    });
  })
  .get("/contacts", jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get("knexInstance");
    knexInstance
      .from("contact_list")
      .where({ user_id: user_id })
      .timeout(10000, { cancel: true })
      .then((kres) => {
        if (kres.length === 0) {
          return res.status(404).json({
            error: "Unable to Locate Contacts",
            errorMessage:
              "The contacts could not be located. Have you added any contacts yet? If yes, please try again later or contact an admin.",
          });
        }
        let contacts = [];
        for (let i = 0; i < kres.length; i++) {
          let currentContact = kres[i];
          console.log(typeof currentContact);
          Object.keys(currentContact).forEach((key) => {
            if (typeof currentContact[key] === "string") {
              currentContact[key] = aes256.decrypt(
                thisSessionKey,
                currentContact[key]
              );
            }
          });
          contacts.push(currentContact);
        }
        contacts.sort((a, b) => {
          return a.contact_id - b.contact_id;
        });
        return res.status(200).json(contacts);
      }).catch(kres => {
        return res.status(500).json({
          error: "knex connection failed",
          errorMessage: kres
        })
      });
  })
  .get("/contact", jsonBodyParser, (req, res, next) => {
    let query = req.query;
    if (query.length === 0) {
      return res.status(404).json({
        error: "No search parameter defined.",
        errorMessage:
          "Please include search parameters in your HTTP request query. See the documentation for more information.",
      });
    }
    if (query.contact_id !== null) {
      query.contact_id = parseInt(query.contact_id);
    }
    let query_keys = Object.keys(query);
    let query_values = Object.values(query);
    const knexInstance = req.app.get("knexInstance");
    knexInstance
      .from("contact_list")
      .where({ user_id: user_id })
      .timeout(10000, { cancel: true })
      .then((kres) => {
        if (kres.length === 0) {
          return res.status(404).json({
            error: "Unable to Locate Contact",
            errorMessage:
              "The contact could not be located. Please alter your search parameters and try again. Note: Capitalization and formatting matters for your search query. Make sure you use the exact spelling, format, and capitalization as you did when you created/updated your contact.",
          });
        }
        let contact = false;
        for (let i = 0; i < kres.length; i++) {
          Object.keys(kres[i]).forEach((key) => {
            if (typeof kres[i][key] === "string") {
              kres[i][key] = aes256.decrypt(thisSessionKey, kres[i][key]);
            }
          });
          let currentContact = kres[i];
          let currentContactKeys = Object.keys(currentContact);
          let currentContactValues = Object.values(currentContact);
          if (currentContactKeys.indexOf(query_keys[0]) !== -1) {
            let matchFound = true;
            for (let j = 0; j < query_keys.length; j++) {
              let currentQueryKey = query_keys[j];
              let index = currentContactKeys.indexOf(currentQueryKey);
              if (index !== -1) {
                if (query_values[j] !== currentContactValues[index]) {
                  j = query_keys.length + 100;
                  matchFound = false;
                }
              }
            }
            if (matchFound) {
              contact = currentContact;
              i = kres.length + 100;
            }
          }
        }

        if (contact !== false) {
          return res.status(200).json(contact);
        } else {
          return res.status(404).json({
            error: "Unable to Locate Contact",
            errorMessage:
              "The contact could not be located. Please alter your search parameters and try again. Note: Capitalization and formatting matters for your search query. Make sure you use the exact spelling, format, and capitalization as you did when you created/updated your contact.",
          });
        }
      })
      .catch((kres) => {
        return res
          .status(500)
          .json({ error: "Knex connection error", errorMessage: kres });
      });
  })
  .get("/contact/:contact_id", jsonBodyParser, (req, res, next) => {
    let contact_id = req.params.contact_id;
    contact_id = parseInt(contact_id);
    if (typeof contact_id !== "number" || isNaN(contact_id)) {
      return res.status(404).json({
        error: "Syntax error",
        errorMessage:
          "Please ensure you include the 'contact_id' of the contact you want to update in your request parameters/url. For example, if you are trying to access contact 7, make your request to /contact/7",
      });
    }
    if (contact_id <= 0) {
      return res.status(404).json({
        error: "Syntax error",
        errorMessage:
        "Please ensure you include the 'contact_id' of the contact you want to update in your request parameters/url. For example, if you are trying to access contact 7, make your request to /contact/7",
      });
    }
    const knexInstance = req.app.get("knexInstance");
    knexInstance.from('contact_list').where({user_id: user_id, contact_id: contact_id}).timeout(10000, {cancel: true}).then(kres => {
      if (kres[0] === undefined) {
        return res.status(404).json({
          error: "Unable to locate contact",
          errorMessage: "Contact could not be located. Ensure you are using the correct contact ID and account."
        })
      }
      else {
        let contact = kres[0]
        let contactKeys = Object.keys(contact)
        contactKeys.forEach((key) => {
          if (typeof contact[key] === "string") {
            contact[key] = aes256.decrypt(thisSessionKey, contact[key])
          }
        })
        return res.status(200).json(contact) 
      }
    })

  })
  .post("/contact", jsonBodyParser, (req, res, next) => {
    let keys = Object.keys(req.body);
    if (keys.length === 0) {
      return res.status(400).json({
        error: "no fields in request body",
        errorMessage: "Please ensure you have fields like 'contact_first_name' in your request body. See the documentation for more details."
      })
    }
    let values = Object.values(req.body);
    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 200) {
        return res.status(400).json({
          error: "Overfill error",
          errorMessage: `The ${keys[i]} value is over 200 characters. Please shorten it and then retry your request.`,
        });
      }
    }
    let knexPost = req.body;

    Object.keys(knexPost).forEach((key) => {
      knexPost[key] = aes256.encrypt(thisSessionKey, knexPost[key]);
    });
    knexPost.user_id = user_id;
    if (knexPost.key) {
      knexPost.key = aes256.encrypt(thisSessionKey, knexPost.key);
    }
    const knexInstance = req.app.get("knexInstance");
    knexInstance("contact_list")
      .insert(knexPost)
      .timeout(10000, { cancel: true })
      .then((kres) => {
        return res.status(201).json(req.body);
      })
      .catch((kres) => {
        return res.status(500).json({
          error: "Knex Connection Failed",
          errorMessage: kres,
        });
      });
  })

  .patch("/contact/:contact_id", jsonBodyParser, (req, res, next) => {
    let contact_id = req.params.contact_id;
    contact_id = parseInt(contact_id);
    let toPatch = req.body;
    let keys = Object.keys(req.body);
    let values = Object.values(req.body);
    if (typeof contact_id !== "number" || isNaN(contact_id)) {
      return res.status(400).json({
        error: "Syntax error",
        errorMessage:
          "Please ensure you include the 'contact_id' of the contact you want to update in your request parameters/url. For example, if you are trying to access contact 7, make your request to /contact/7",
      });
    }
    if (contact_id <= 0) {
      return res.status(400).json({
        error: "Syntax error",
        errorMessage:
        "Please ensure you include the 'contact_id' of the contact you want to update in your request parameters/url. For example, if you are trying to access contact 7, make your request to /contact/7",
      });
    }
    if (keys.length === 0) {
      return res.status(400).json({
        error: "Syntax error",
        errorMessage: "Please ensure you have fields like 'contact_first_name' in your request body. See the documentation for more details."
      })
    }
    if (keys.indexOf(contact_id) !== -1) {
      return res.status(400).json({
        error: "Syntax error",
        errorMessage: "Please only include the 'contact_id' in your request query/parameters, not the body."
      })
    }
    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 200) {
        return res.status(400).json({
          error: "Overfill error",
          errorMessage: `The ${keys[i]} value is over 200 characters. Please shorten it and then retry your request.`,
        });
      }
    }

    Object.keys(toPatch).forEach((key) => {
      toPatch[key] = aes256.encrypt(thisSessionKey, toPatch[key]);
    });
    const knexInstance = req.app.get("knexInstance")
    knexInstance.from('contact_list').where({contact_id: contact_id, user_id: user_id}).select('contact_id', 'user_id').timeout(10000, { cancel: true }).then((kres1) => {
      if (kres1[0] === undefined) {
        return res.status(404).json({
          error: "Unable to locate contact",
          errorMessage: "Contact could not be located. Ensure you are using the correct contact ID and account."
        })
      }
      else {
        knexInstance('contact_list').where({user_id: user_id, contact_id: contact_id}).update(toPatch).then((kres2) => {
          res.status(200).json({
            message: "Your contact was successfully updated."
          })
        }).catch((kres2) => {
          return res.status(500).json({
            error: "Knex Connection Error. Could not update contact info",
            errorMessage: kres2
          })
        })      
      }
    })
  })

module.exports = userRouter;
