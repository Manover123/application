const express = require("express");
const user = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const Multer = require("multer");
const { FirebaseApp } = require("./firebase");

user.use(cors());
user.use(express.json());

user.get("/usermember", (req, res) => {
  db.query("SELECT * FROM usermember", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

user.post("/createUsermember", multer.single("avatar"), (req, res) => {
  db.query(`SELECT MAX(id_us)AS oldID FROM usermember`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const folder = "profileUser";
      const fileName = `${folder}/${Date.now() + "-" + req.file.originalname}`;
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      blobStream.end(req.file.buffer);
      const name_us = req.body.name_us;
      const address_us = req.body.houseNumber_us;
      const postalcode_us = req.body.postalcode_us;
      const email_us = req.body.email_us;
      const profile_us = fileName.split("/").pop();
      const username_us = req.body.username_us;
      const password_us = req.body.password_us;
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

user.delete("/deleteuser/:id_us", (req, res) => {
  const id_us = req.params.id_us;
  db.query("DELETE FROM usermember WHERE id_us =?", id_us, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

user.put("/update", multer.single("avatar_update"), (req, res) => {
  if (!req.file) {
    const { id_us } = req.body;
    const { us_name } = req.body;
    const { us_no } = req.body;
    const { us_postalcode } = req.body;
    const { us_email } = req.body;
    const { us_username } = req.body;
    const { us_password } = req.body;

    db.query(
      "UPDATE usermember SET name_us=?, address_us = ?,	postalcode_us = ?,email_us=?,username_us = ? ,password_us =? WHERE id_us  = ?",
      [
        us_name,
        us_no,
        us_postalcode,
        us_email,
        us_username,
        us_password,
        id_us,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    const file = bucket.file(`profileUser/${req.body.deleteProfile}`);
    file.delete().then((downloadResponse) => {
      res.status(200).send(downloadResponse[0]);
    });
    const folder = "profileUser";
    const fileName = `${folder}/${Date.now() + "-" + req.file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    blobStream.end(req.file.buffer);
    const { id_us } = req.body;
    const { us_name } = req.body;
    const { us_no } = req.body;
    const { us_postalcode } = req.body;
    const profile_us = fileName.split("/").pop();
    const { us_username } = req.body;
    const { us_password } = req.body;

    db.query(
      "UPDATE usermember SET name_us=?, address_us = ?,	postalcode_us = ?,profile_us=?,username_us = ? ,password_us =? WHERE id_us  = ?",
      [
        us_name,
        us_no,
        us_postalcode,
        profile_us,
        us_username,
        us_password,
        id_us,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  }
});
user.get("/delete_profileUser/:profile_us", (req, res) => {
  const file = bucket.file(`profileUser/${req.params.profile_us}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
});

user.put("/updateStatusbanl_us", (req, res) => {
  const statusBan_us = req.body.statusBan_us;
  const id_us = req.body.id_us;

  if (statusBan_us == 1) {
    db.query(
      "UPDATE usermember SET statusBan_us = 0 WHERE id_us =?",
      id_us,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    db.query(
      "UPDATE usermember SET statusBan_us = 1 WHERE id_us =?",
      id_us,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
});

module.exports = user;
