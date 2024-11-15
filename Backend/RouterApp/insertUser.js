const express = require("express");
const insertUser = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");
const Multer = require("multer");
const { FirebaseApp } = require("../RouterWeb/firebase");

insertUser.use(cors());
insertUser.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

insertUser.post("/insertUserApp", multer.array("photo", 3), (req, res) => {
  db.query(`SELECT MAX(id_us)AS oldID FROM usermember`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const folder = "profileUser";
      const fileName = `${folder}/${Date.now()}`;
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.files[0].mimetype,
        },
      });
      blobStream.end(req.files[0].buffer);
      const name_us = req.body.nameUser;
      const address_us = req.body.address;
      const postalcode_us = req.body.postalcode;
      const email_us = req.body.email;
      const profile_us = fileName.split("/").pop();
      const username_us = req.body.usermane;
      const password_us = req.body.password;
      const idnew = parseInt(result[0].oldID) + 1;
      if (idnew >= 10) {
        const data = "0";
        const idNews = data + idnew.toString();
        db.query(
          "INSERT INTO usermember (id_us,name_us,address_us,postalcode_us,email_us,profile_us,username_us,password_us) VALUES(?,?,?,?,?,?,?,?)",
          [
            idNews,
            name_us,
            address_us,
            postalcode_us,
            email_us,
            profile_us,
            username_us,
            password_us,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Values insertd");
            }
          }
        );
      } else {
        const data = "00";
        const idnew = parseInt(result[0].oldID) + 1;
        const idNews = data + idnew.toString();
        db.query(
          "INSERT INTO usermember (id_us,name_us,address_us,postalcode_us,email_us,profile_us,username_us,password_us) VALUES(?,?,?,?,?,?,?,?)",
          [
            idNews,
            name_us,
            address_us,
            postalcode_us,
            email_us,
            profile_us,
            username_us,
            password_us,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Values insertd");
            }
          }
        );
      }
    }
  });
});

insertUser.put("/updateUser", multer.array("photo", 3), (req, res) => {
  const file = bucket.file(`profileUser/${req.body.old_image}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
  const folder = "profileUser";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const profile_us = fileName.split("/").pop();
  const name_us = req.body.nameuser;
  const address_us = req.body.address;
  const postalcode_us = req.body.postalcode;
  const username_us = req.body.username;
  const email_us = req.body.email;
  const password_us = req.body.password;
  const id_us = req.body.id_us;
  db.query(
    "UPDATE usermember SET name_us=?, address_us = ?,	postalcode_us = ?,email_us=?,username_us = ? ,password_us =?,profile_us=? WHERE id_us  = ?",
    [
      name_us,
      address_us,
      postalcode_us,
      email_us,
      username_us,
      password_us,
      profile_us,
      id_us,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

insertUser.put("/updateUser_Nofile", (req, res) => {
  const name_us = req.body.nameuser;
  const address_us = req.body.address;
  const postalcode_us = req.body.postalcode;
  const username_us = req.body.username;
  const email_us = req.body.email;
  const password_us = req.body.password;
  const id_us = req.body.id_us;
  db.query(
    "UPDATE usermember SET name_us=?, address_us = ?,	postalcode_us = ?,email_us=?,username_us = ? ,password_us =? WHERE id_us  = ?",
    [
      name_us,
      address_us,
      postalcode_us,
      email_us,
      username_us,
      password_us,
      id_us,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

insertUser.get("/loadNewuser/:id_us", (req, res) => {
  const id_us = req.params.id_us;
  db.query(
    "SELECT * FROM `usermember` WHERE `id_us`=?",
    id_us,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = insertUser;
