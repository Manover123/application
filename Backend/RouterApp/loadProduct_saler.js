const express = require("express");
const loadProduct_sal = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

loadProduct_sal.use(cors());
loadProduct_sal.use(express.json());

loadProduct_sal.get("/product_sal/:idlock", (req, res) => {
  const idlock = req.params.idlock;
  db.query(
    `SELECT id_product,id_sal,id_lock,image_Product,name_product,number_product,price_product,unit_product,details_Product,name_lock,status_open,IF(status_open = 1,"true","false") as name_status FROM  product_mbs INNER JOIN locksale USING (id_lock) WHERE id_lock = ?;`,
    idlock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadProduct_sal.get("/typeProductName/:idlock", (req, res) => {
  const idlock = req.params.idlock;
  db.query(
    "SELECT typeProduct,img_mrk FROM  lease_agreement  WHERE id_lock = ?;",
    idlock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadProduct_sal.get("/getnamelock/:idlock", (req, res) => {
  const idlock = req.params.idlock;
  db.query(
    "SELECT name_lock,id_lock,status_open FROM locksale WHERE id_lock = ?",
    idlock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadProduct_sal.get("/getLock/:id_usale", (req, res) => {
  const id_usale = req.params.id_usale;
  db.query(
    "SELECT id_lock , name_lock FROM lease_agreement INNER JOIN locksale USING(id_lock) WHERE id_sal = ?;",
    id_usale,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        // console.log(result);
      }
    }
  );
});

loadProduct_sal.get("/getProductByID/:id_product", (req, res) => {
  const id_usale = req.params.id_product;
  db.query(
    "SELECT * FROM product_mbs WHERE id_product = ?",
    id_usale,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        // console.log(result);
      }
    }
  );
});
loadProduct_sal.get("/getNameproduct/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "SELECT name_product FROM product_mbs WHERE id_lock =?",
    id_lock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadProduct_sal.put("/open/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "UPDATE locksale SET status_open	=1 WHERE id_lock  = ?",
    id_lock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        // console.log(result);
      }
    }
  );
});
loadProduct_sal.put("/off_openmak/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "UPDATE locksale SET status_open	=0 WHERE id_lock  = ?",
    id_lock,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        // console.log(result);
      }
    }
  );
});

module.exports = loadProduct_sal;
