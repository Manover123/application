const express = require("express");
const loadMK = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

loadMK.use(cors());
loadMK.use(express.json());

// loadMK.get("/loadMarketPopular", (req, res) => {
//   db.query(
//     `SELECT * from (
//     SELECT id_iease,id_sal,p.id_lock,typeProduct,nameMarket_sal,name_lock,status_open,IF(status_open=1,"เปิดร้าน","ปิดร้าน") AS status_name,img_mrk,COUNT(id_order) AS sumorder
//     FROM purchase_order
//     LEFT JOIN locksale p
//     USING(id_lock)
//     LEFT JOIN lease_agreement
//     USING(id_sal)
//     LEFT JOIN membersaler
//     USING(id_sal)
//     WHERE status_order = 0
//     GROUP BY p.id_lock
// ) as t1
// WHERE t1.sumorder / 2 > 5;`,
//     (err, result) => {
//       if (err) {
//         res.status(404).send(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

loadMK.get("/loadMarketPopular", (req, res) => {
  db.query(
    `SELECT * from(
      SELECT id_iease,p.id_lock,typeProduct,name_lock,status_open,IF(status_open=1,"เปิดร้าน","ปิดร้าน") AS status_name,img_mrk ,nameMarket_sal,COUNT(id_order)AS sumorder 
      FROM purchase_order 
      RIGHT JOIN membersaler
      USING (id_sal)
      LEFT JOIN locksale p 
      USING (id_lock) 
      LEFT JOIN lease_agreement 
      USING (id_lock)
      GROUP BY id_lock
    ) as t1
    WHERE t1.sumorder > 5;`,
    (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadMK.get("/loadMarket", (req, res) => {
  db.query(
    `SELECT id_iease,id_sal,id_lock,profile_sal,typeProduct,nameMarket_sal,name_lock,status_open,IF(status_open=1,"เปิดร้าน","ปิดร้าน") AS status_name,img_mrk FROM lease_agreement INNER JOIN membersaler USING (id_sal)INNER JOIN locksale USING (id_lock) ORDER BY id_iease DESC;`,
    (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(result);
      }
    }
  );
});
loadMK.get("/product/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "SELECT `id_product`,`id_lock`,`name_product`,image_Product ,number_product, price_product ,unit_product, details_Product FROM product_mbs INNER JOIN lease_agreement USING (id_lock) WHERE id_lock = ?",
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
loadMK.get("/memberSal/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "SELECT `id_sal`,`id_lock`,`name_lock`,name_sal,profile_sal,`typeProduct`,nameMarket_sal,accountnumber_sal,bank_sal,zipcode_sal,email_sal FROM `lease_agreement`INNER JOIN membersaler USING(id_sal)INNER JOIN locksale USING(id_lock)WHERE id_lock= ?;",
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

loadMK.get("/loadtypeProducts", (req, res) => {
  db.query(`SELECT * FROM type_product`, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result);
    }
  });
});

loadMK.get("/loaddataMarketByname/:item", (req, res) => {
  const item = req.params.item;
  console.log(item);
  db.query(
    `SELECT id_iease,id_sal,id_lock,profile_sal,typeProduct,nameMarket_sal,name_lock,status_open,IF(status_open=1,"เปิดร้าน","ปิดร้าน") AS status_name,img_mrk FROM lease_agreement INNER JOIN membersaler USING (id_sal)INNER JOIN locksale USING (id_lock)WHERE typeProduct=?;`,
    [item],
    (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(result);
      }
    }
  );
});
module.exports = loadMK;
