const express = require("express");
const insertProduct = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");
const Multer = require("multer");
const { FirebaseApp } = require("../RouterWeb/firebase");

insertProduct.use(cors());
insertProduct.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const storage = FirebaseApp.storage();
const bucket = storage.bucket();

insertProduct.post("/insertProduct", multer.array("photo", 3), (req, res) => {
  const folder = "product";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const classDataadd = {
    id_sal: req.body.id_sal,
    id_lock: req.body.id_lock,
    image_Product: fileName.split("/").pop(),
    name_product: req.body.name_product,
    number_product: req.body.number_product,
    price_product: req.body.price_product,
    unit_product: req.body.unit_product,
    details_Product: req.body.details_Product,
  };
  const sql = "INSERT INTO product_mbs SET ?";
  db.query(sql, classDataadd, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});
insertProduct.put(
  "/updateProductImage",
  multer.array("photo", 3),
  (req, res) => {
    // console.log(JSON.parse(req.body.id_lock));
    const file = bucket.file(`product/${req.body.old_image}`);
    file.delete().then((downloadResponse) => {
      res.status(200).send(downloadResponse[0]);
    });
    const folder = "market";
    const fileName = `${folder}/${Date.now()}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.files[0].mimetype,
      },
    });
    blobStream.end(req.files[0].buffer);
    const image_Product = fileName.split("/").pop();
    const id_lock = JSON.parse(req.body.id_lock);
    db.query(
      "UPDATE lease_agreement SET img_mrk=? WHERE id_lock =?",
      [image_Product, id_lock],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.send(results);
        }
      }
    );
  }
);

insertProduct.put("/updateProduct", multer.array("photo", 3), (req, res) => {
  const file = bucket.file(`product/${req.body.old_image}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
  const folder = "product";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.files[0].mimetype,
    },
  });
  blobStream.end(req.files[0].buffer);
  const image_Product = fileName.split("/").pop();
  const name_product = req.body.name_product;
  const number_product = req.body.number_product;
  const price_product = req.body.price_product;
  const unit_product = req.body.unit_product;
  const details_Product = req.body.details_Product;
  const id_product = req.body.id_product;
  db.query(
    "UPDATE  product_mbs SET name_product=?,number_product=?,price_product=?,	unit_product=?,image_Product=?,details_Product=? WHERE id_product =?",
    [
      name_product,
      number_product,
      price_product,
      unit_product,
      image_Product,
      details_Product,
      id_product,
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

insertProduct.put("/updateProduct_Nofile", (req, res) => {
  const name_product = req.body.name_product;
  const number_product = req.body.number_product;
  const price_product = req.body.price_product;
  const unit_product = req.body.unit_product;
  const details_Product = req.body.details_Product;
  const id_product = req.body.id_product;
  db.query(
    "UPDATE  product_mbs SET 	name_product=?,number_product=?,price_product=?,unit_product=?,details_Product=? WHERE id_product  = ?",
    [
      name_product,
      number_product,
      price_product,
      unit_product,
      details_Product,
      id_product,
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

insertProduct.delete("/deleteByid/:idProduct", (req, res) => {
  const id_product = req.params.idProduct;
  db.query(
    "DELETE FROM product_mbs WHERE id_product =?",
    id_product,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
insertProduct.get("/delete_product/:idProduct_img", (req, res) => {
  const file = bucket.file(`product/${req.params.idProduct_img}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
});

module.exports = insertProduct;
