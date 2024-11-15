const express = require("express");
const purchase = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

purchase.use(cors());
purchase.use(express.json());

purchase.get("/loadPurchase/:id_us", (req, res) => {
  const id_us = req.params.id_us;
  console.log(" id" + id_us);
  db.query(
    "SELECT nameMarket_sal,profile_sal,date_order,id_order,name_lock,status_order,zipcode_sal ,accountnumber_sal,bank_sal,  CASE WHEN status_order =1 THEN 'รอการยืนยัน' WHEN status_order =2 THEN 'กรุณาอัพโหลดสลิป'ELSE 'รอรับของ'END AS nameStatus, SUM(p.totalPrice) AS sumPrice FROM purchase_order INNER JOIN list_product p USING (id_order)   INNER JOIN membersaler USING (id_sal)   INNER JOIN locksale USING (id_lock)  WHERE id_us = ?   AND status_order !=0  AND status_order !=4 GROUP BY id_order ORDER BY id_order DESC;",
    id_us,
    (err, result) => {
      if (err) {
      } else {
        res.send(result);
        console.log("data get" + result);
      }
    }
  );
});
purchase.get("/loadlistItem/:id_order", (req, res) => {
  const id_order = req.params.id_order;
  db.query(
    "SELECT id_product , qty,old_price,totalPrice,name_product,unit_product,image_slip,old_price FROM purchase_order INNER JOIN list_product USING (id_order)INNER JOIN product_mbs USING (id_product) WHERE id_order = ?",
    id_order,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
purchase.get("/loadPurchasHistory/:id_us", (req, res) => {
  const id_us = req.params.id_us;
  console.log(id_us);
  db.query(
    `SELECT nameMarket_sal , profile_sal ,date_order,id_order,name_lock,status_order ,if(status_order = 0,"ยืนยันเเล้ว","ไม่ผ่านการยืนยัน") AS namestatus FROM purchase_order INNER JOIN membersaler USING (id_sal)  INNER JOIN locksale USING (id_lock) WHERE id_us = ?   AND status_order != 1 AND status_order != 2 AND status_order != 3  ORDER BY id_order DESC;`,
    id_us,
    (err, result) => {
      if (err) {
      } else {
        res.send(result);
        console.log(result);
      }
    }
  );
});

//membersale
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

purchase.get("/loadUserOrder/:id_sal", (req, res) => {
  const id_sal = req.params.id_sal;
  db.query(
    "SELECT name_us , profile_us ,date_order,id_order,name_lock,status_order,CASE WHEN status_order =1 THEN 'รอการยืนยัน' WHEN status_order =2 THEN 'ยังไม่ได้อัพสลิป'ELSE 'รอรับของ'END AS nameStatus,SUM(p.totalPrice) AS sumPrice FROM purchase_order  INNER JOIN list_product p USING (id_order)  INNER JOIN usermember USING (id_us)  LEFT JOIN locksale USING (id_lock)  WHERE id_sal = ? AND status_order !=0  AND status_order !=4  GROUP BY id_order ORDER BY id_order DESC;",
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

purchase.get("/loadUserbyid/:id_order", (req, res) => {
  const id_order = req.params.id_order;
  db.query(
    "SELECT id_product , qty,old_price,totalPrice,name_product,unit_product,image_slip,number_product FROM purchase_order INNER JOIN list_product USING (id_order)INNER JOIN product_mbs USING (id_product) WHERE id_order = ?",
    id_order,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
purchase.put("/comfirmorder/:id_order", (req, res) => {
  const id_order = req.params.id_order;
  db.query(
    "UPDATE purchase_order SET status_order=3  WHERE id_order = ?",
    id_order,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

purchase.put("/cancelOrder/:id_order", (req, res) => {
  const id_order = req.params.id_order;
  const idProduct = req.body.idporDuct;
  const itemUpdate = req.body.itemUpdate;
  db.query(
    "UPDATE purchase_order SET status_order=4 WHERE id_order = ?",
    id_order,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        for (let i = 0; i < idProduct.length; i++) {
          db.query(
            "UPDATE product_mbs SET number_product=? WHERE id_product =?",
            [itemUpdate[i], idProduct[i]]
          );
        }
      }
    }
  );
});

purchase.get("/succeedorder/:id_order", (req, res) => {
  const id_order = req.params.id_order;
  db.query(
    "UPDATE purchase_order SET status_order=0  WHERE id_order = ?",
    id_order,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

purchase.get("/loadUserOrderHistory/:id_sal", (req, res) => {
  const id_sal = req.params.id_sal;
  db.query(
    "SELECT name_us , profile_us ,date_order,id_order,status_order ,if(status_order = 0,'ยืนยันเเล้ว','ถูกยกเลิก') as statusname FROM purchase_order INNER JOIN usermember USING (id_us)  WHERE id_sal = ?   ORDER BY id_order DESC;",
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

module.exports = purchase;
