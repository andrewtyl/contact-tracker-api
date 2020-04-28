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
    return res.status(500).json("In Development");
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
      .timeout(1000, { cancel: true })
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
    console.log(genSalt);
    console.log(typeof genSalt);
    return res.status(500).json({});
  })
  .get("/aesTest", (req, res) => {
    const ares_encrypted = aes256.encrypt("yeet", "SD2moxEAM0pI565nLgBCyr5FIbDKAMbT71eVohYzWVAIIXaMYUB4ca3Mt6CWpBcA2v6sBF0izy8erjp114ACj8WOarA1GgCpJLVMgSftPlOIHysfpZYnDfMsdwuSbQLNwT0Ui1PVZcMnldPJk8PEklokFvieQ6J0N63tJlFEW0CxwhBK3gbsasqRakvwYe3oUEZmVrU8")
    console.log(`ares_encrypted = ${ares_encrypted}`)
    console.log(ares_encrypted.length)
    const ares_decrypted = aes256.decrypt("yeet", ares_encrypted)
    console.log(`ares_decrypted = ${ares_decrypted}`)
    return res.status(500).json({})
  });

module.exports = testRouter;
