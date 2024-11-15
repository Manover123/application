const express = require("express");
const lease = express.Router();
const db = require("../config/configData");
const cors = require("cors");

lease.use(cors());
lease.use(express.json());

lease.get("/getDatalease", (req, res) => {
  db.query(
    "SELECT`id_iease`,`id_sal`,`id_lock`,`nameGive_lock`,`dateNow`,`dateEnd`,name_lock,typeProduct FROM `lease_agreement` INNER JOIN locksale USING(id_lock)  ORDER by id_iease DESC; ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

lease.get("/loadmeMbersalerByids/:id_sal", (req, res) => {
  const id_sal = req.params.id_sal;
  db.query(
    "SELECT * FROM membersaler WHERE cardnumber_sal = ?",
    id_sal,
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
lease.get("/loaddataIDlock/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  db.query(
    "SELECT * FROM locksale WHERE name_lock = ?",
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

lease.post("/insertLease", (req, res) => {
  const data = req.body.data;
  const lock = req.body.data;
  const updatelock = lock.map((val) => val.id_lock);
  const status = 0;
  let values = [];
  for (let i = 0; i < data.length; i++) {
    values.push([
      data[i].id_sal,
      data[i].id_lock,
      data[i].nameGive_lock,
      data[i].typeProduct,
      data[i].dateNow,
      data[i].dateEnd,
    ]);
  }
  let locks = [];
  for (let i = 0; i < lock.length; i++) {
    locks.push([lock[i].id_lock]);
  }

  db.query(
    "INSERT INTO lease_agreement (id_sal,id_lock,nameGive_lock,typeProduct,dateNow,dateEnd) VALUES ?",
    [values],
    (err, result) => {
      if (result) {
        console.log("เพิ่มข้อสัญยาเช่าเรียบร้อย");
        res.send(result);
      } else {
        console.log("erorr" + err);
      }
    }
  );
  db.query(
    "UPDATE locksale SET status=? WHERE id_lock in (?) ",
    [status, updatelock],
    (err, result) => {
      if (result) {
        console.log("อัพเดทล็อคขายเรียบร้อย");
      } else {
        console.log(err);
      }
    }
  );
});

lease.get("/deleteLease/:id_lock", (req, res) => {
  const id_lock = req.params.id_lock;
  const status = 1;
  db.query(
    "DELETE FROM lease_agreement WHERE id_lock =?",
    id_lock,
    (err, result) => {
      if (result) {
        console.log("succeed");
        res.send(result);
        db.query(
          "UPDATE locksale SET status= 1 WHERE id_lock =? ",
          id_lock,
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("updateLock..succeed");
            }
          }
        );
        db.query(
          "UPDATE locksale SET status_open= 0 WHERE id_lock =? ",
          id_lock,
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("updateLock..succeed");
            }
          }
        );
      } else {
        console.log("erorr" + err);
      }
    }
  );
  db.query(
    "UPDATE product_mbs SET id_lock = 0 WHERE id_lock =?",
    id_lock,
    (err, result) => {
      if (result) {
        console.log("succeed");
        // res.send(result);
      } else {
        console.log("erorr" + err);
      }
    }
  );
  // db.query(
  //   "UPDATE locksale SET status=? WHERE id_lock =? ",
  //   [status, id_lock],
  //   (err, result) => {
  //     if (result) {
  //       console.log("succeed");
  //       // res.send(result);
  //     } else {
  //       console.log("erorr" + err);
  //     }
  //   }
  // );
});

lease.put("/updateTimelease", (req, res) => {
  const dateNow = req.body.dateNowEdit;
  const dateEnd = req.body.dateEndEdit;
  const typeProduct = req.body.typeProduct;
  const id_lock = req.body.id_lock;
  console.log(dateNow);
  console.log(dateEnd);
  console.log(typeProduct);
  console.log(id_lock);

  db.query(
    "UPDATE lease_agreement SET dateNow=?,dateEnd=?,typeProduct=? WHERE id_lock =? ",
    [dateNow, dateEnd, typeProduct, id_lock],
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err);
      }
    }
  );
});

module.exports = lease;
