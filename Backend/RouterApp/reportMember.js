const express = require("express");
const reportMember = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

reportMember.use(cors());
reportMember.use(express.json());

reportMember.post("/reportMember", (req, res) => {
  const dateStart = req.body.dateStart;
  const dateEnd = req.body.dateEnd;
  const id_sal = req.body.id_sal;
  console.log(dateStart, dateEnd, id_sal);

  db.query(
    "SELECT id_order,date_order ,COUNT( p.id_order )AS sumIdorder,SUM(totalPrice)AS Totalsum FROM purchase_order INNER JOIN list_product p USING(id_order) WHERE  status_order =0 AND  id_sal = ? AND date_order  BETWEEN ? AND ?GROUP BY id_order;",
    [id_sal, dateStart, dateEnd],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

reportMember.post("/reportUser", (req, res) => {
  const dateStart = req.body.dateStart;
  const dateEnd = req.body.dateEnd;
  const id_us = req.body.id_us;

  console.log(dateStart, dateEnd, id_us);

  db.query(
    "SELECT name_product ,qty,old_price,unit_product,totalPrice,date_order FROM purchase_order p INNER JOIN list_product   USING (id_order) INNER JOIN product_mbs USING (id_product) WHERE  p.id_us =? AND status_order = 0  AND date_order between ? AND ?;",
    [id_us, dateStart, dateEnd],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = reportMember;
