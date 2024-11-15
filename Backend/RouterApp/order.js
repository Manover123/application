const express = require("express");
const order = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");
const Multer = require("multer");
const { FirebaseApp } = require("../RouterWeb/firebase");

order.use(cors());
order.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

order.post("/insertOrder", multer.array("photo", 3), (req, res) => {
  const folder = "slip";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const id_sal = req.body.id_sal;
  const id_lock = req.body.id_lock;
  const id_us = req.body.id_us;
  const date_order = req.body.date_order;
  const image_slip = fileName.split("/").pop();
  const itemProduct = JSON.parse(req.body.itemProduct);
  const update1 = JSON.parse(req.body.update1);
  const update2 = JSON.parse(req.body.update2);
  const status_order = 1;

  console.log(itemProduct);

  db.query(
    "INSERT INTO purchase_order (`id_sal`,id_lock,`id_us`,`date_order`,image_slip,status_order) VALUES (?,?,?,NOW(),?,?)",
    [id_sal, id_lock, id_us, image_slip, status_order],
    (err, result) => {
      if (err) {
      } else {
        let values = [];
        for (let i = 0; i < itemProduct.length; i++) {
          values.push([
            result.insertId,
            itemProduct[i].id_product,
            itemProduct[i].price_product,
            itemProduct[i].num,
            itemProduct[i].amout,
          ]);
        }
        db.query(
          "INSERT INTO list_product (id_order,id_product,old_price,qty,totalPrice) VALUES ?",
          [values]
        );
        res.send(result);
        for (let i = 0; i < update2.length; i++) {
          db.query(
            "UPDATE product_mbs SET number_product=? WHERE id_product =?",
            [update1[i], update2[i]]
          );
        }
      }
    }
  );
});

order.post("/insertOrderNoslip", (req, res) => {
  const id_sal = req.body.id_sal;
  const id_lock = req.body.id_lock;
  const id_us = req.body.id_us;
  const itemProduct = JSON.parse(req.body.itemProduct);
  const update1 = JSON.parse(req.body.update1);
  const update2 = JSON.parse(req.body.update2);
  const status_order = 2;
  console.log(id_sal, id_lock, id_us, itemProduct, update1, update2);

  db.query(
    "INSERT INTO purchase_order (`id_sal`,id_lock,`id_us`,`date_order`,status_order) VALUES (?,?,?,NOW(),?)",
    [id_sal, id_lock, id_us, status_order],
    (err, result) => {
      if (err) {
      } else {
        let values = [];
        for (let i = 0; i < itemProduct.length; i++) {
          values.push([
            result.insertId,
            itemProduct[i].id_product,
            itemProduct[i].price_product,
            itemProduct[i].num,
            itemProduct[i].amout,
          ]);
        }
        db.query(
          "INSERT INTO list_product (id_order,id_product, old_price,qty,totalPrice) VALUES ?",
          [values]
        );
        res.send(result);
        for (let i = 0; i < update2.length; i++) {
          db.query(
            "UPDATE product_mbs SET number_product=? WHERE id_product =?",
            [update1[i], update2[i]]
          );
        }
      }
    }
  );
});

order.put("/updateSlip", multer.array("photo", 3), (req, res) => {
  const folder = "slip";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const image_slip = fileName.split("/").pop();
  const id_order = req.body.id_order;

  db.query(
    "UPDATE purchase_order SET image_slip =? ,status_order = 1  WHERE  id_order = ?",
    [image_slip, id_order],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

module.exports = order;
