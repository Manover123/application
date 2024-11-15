const express = require("express");
const lock = express.Router();
const db = require("../config/configData");
const cors = require("cors");

lock.use(cors());
lock.use(express.json());

lock.get("/locksaleweb", (req, res) => {
  db.query(
    `SELECT *,IF(status_open= 1,"เปิด","ปิด")AS statusname , IF(status = 0,"ถูกเช่าอยู่","ยังว่าง")AS onstatus  FROM locksale`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

lock.get("/locksale", (req, res) => {
  db.query("SELECT * FROM locksale WHERE status=1 ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

lock.post("/createlocksale", (req, res) => {
  const name_product = req.body.name_product;

  db.query(
    "INSERT INTO locksale (name_lock) VALUES(?)",
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

lock.delete("/deleterlocksale/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query("DELETE FROM locksale WHERE id_lock =?", id_lock, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

lock.put("/updatelocksale", (req, res) => {
  const { id_product } = req.body;
  const { nameProduct } = req.body;
  db.query(
    "UPDATE locksale SET name_lock=? WHERE id_lock  = ?",
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

lock.post("/testadd", (req, res) => {
  console.log(req.body.lockSale[0].name_lock, req.body.lockSale[1].name_lock);

  const name_product = req.body.lockSale[0].name_lock;
  const name_product2 = req.body.lockSale[1].name_lock;

  db.query(
    "INSERT INTO test (name_lock) VALUES(?),(?)",
    [name_product, name_product2],

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values insertd");
      }
    }
  );
});

lock.post("/test", (req, res) => {
  // const data = "over";

  db.query(`SELECT MAX(id)AS oldID FROM runidauto`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const name = "over";
      const data = "00";
      const idnew = parseInt(result[0].oldID) + 1;
      const idNews = data + idnew.toString();
      db.query(
        "INSERT INTO runidauto (id,name) VALUES (?,?)",
        [idNews, name],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Values insertd");
          }
        }
      );
    }
  });
});

module.exports = lock;
