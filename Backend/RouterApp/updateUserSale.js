const express = require("express");
const updateSale = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");
const Multer = require("multer");
const { FirebaseApp } = require("../RouterWeb/firebase");

updateSale.use(cors());
updateSale.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

updateSale.get("/loadSaler/:id_sal", (req, res) => {
  const id_sal = req.params.id_sal;
  db.query(
    "SELECT * FROM `membersaler` WHERE `id_sal`=?",
    id_sal,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
updateSale.get("/loadType", (req, res) => {
  db.query("SELECT * FROM `type_product` ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

updateSale.put("/updateUserSale", multer.array("photo", 3), (req, res) => {
  const file = bucket.file(`profile/${req.body.old_image}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
  const folder = "profile";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const profile_sal = fileName.split("/").pop();
  const name_sal = req.body.nameSale;
  const password_sal = req.body.password_sal;
  const nameMarket_sal = req.body.nameMarket;

  const id_sal = req.body.id_sal;
  db.query(
    "UPDATE membersaler SET name_sal=?, nameMarket_sal = ?,profile_sal=?,password_sal=? WHERE id_sal  = ?",
    [name_sal, nameMarket_sal, profile_sal, password_sal, id_sal],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

updateSale.put("/updateUserSale_Nofile", (req, res) => {
  const password = req.body.password_sal;
  const name_sal = req.body.namesale;
  const nameMarket_sal = req.body.nameMarket;
  const typeProduct_sal = req.body.typeProduct;
  const password_sal = req.body.password_sal;
  const id_sal = req.body.id_sal;
  db.query(
    "UPDATE membersaler SET name_sal=?, nameMarket_sal = ?,password_sal=?,	typeProduct_sal = ? WHERE id_sal  = ?",
    [name_sal, nameMarket_sal, typeProduct_sal, password_sal, id_sal],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

module.exports = updateSale;
