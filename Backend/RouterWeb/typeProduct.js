const express = require("express");
const typeproduct = express.Router();
const db = require("../config/configData");
const cors = require("cors");

typeproduct.use(cors());
typeproduct.use(express.json());

typeproduct.get("/typeProduct", (req, res) => {
  db.query("SELECT * FROM type_product", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

typeproduct.post("/createTypeproduct", (req, res) => {
  const name_product = req.body.name_product;

  db.query(
    "INSERT INTO type_product (name_product) VALUES(?)",
    [name_product],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values insertd");
      }
    }
  );
});

typeproduct.delete("/deleterType/:id_product", (req, res) => {
  const id_product = req.params.id_product;
  db.query(
    "DELETE FROM type_product WHERE id_product =?",
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

typeproduct.put("/updateTyep", (req, res) => {
  const { id_product } = req.body;
  const { nameProduct } = req.body;
  db.query(
    "UPDATE type_product SET name_product=? WHERE id_product  = ?",
    [nameProduct, id_product],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = typeproduct;
