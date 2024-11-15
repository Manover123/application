const express = require("express");
const membersale = express.Router();
const path = require("path");
const db = require("../config/configData");
const cors = require("cors");
const Multer = require("multer");
// const firebase = require("./firebase");
const { FirebaseApp } = require("./firebase");

membersale.use(cors());
membersale.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const storage = FirebaseApp.storage();
const bucket = storage.bucket();
membersale.post("/registerMembersale", multer.single("avatar"), (req, res) => {
  db.query(`SELECT MAX(id_sal)AS oldID_sal FROM membersaler`, (err, result) => {
    const folder = "profile";
    const fileName = `${folder}/${Date.now() + "-" + req.file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    blobStream.end(req.file.buffer);
    if (err) {
      console.log(err);
    } else {
      const substring = result[0].oldID_sal;
      const idnew = parseInt(substring.substring(1, 4));
      const sum = parseInt(idnew) + 1;

      if (sum >= 10) {
        const data = "S0";
        const idNews = data + sum.toString();
        const sale = "sale";
        const userNameSale = sale + req.body.username_ins;
        const classDataadd = {
          id_sal: idNews,
          name_sal: req.body.name_ins,
          cardnumber_sal: req.body.cardnumber_ins,
          address_sal: req.body.hoseNum_ins,
          zipcode_sal: req.body.zipcode_ins,
          email_sal: req.body.email_ins,
          accountnumber_sal: req.body.accountnumber_ins,
          bank_sal: req.body.bank_ins,
          profile_sal: fileName.split("/").pop(),
          username_sal: userNameSale,
          password_sal: req.body.password_ins,
          typeProduct_sal: req.body.typeProduct_ins,
          nameMarket_sal: req.body.nameMarket_ins,
        };
        const sql = "INSERT INTO membersaler SET ?";
        db.query(sql, classDataadd, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.send(results);
          }
        });
      } else {
        const data = "S00";
        const idNews = data + sum.toString();

        const classDataadd = {
          id_sal: idNews,
          name_sal: req.body.name_ins,
          cardnumber_sal: req.body.cardnumber_ins,
          address_sal: req.body.hoseNum_ins,
          zipcode_sal: req.body.zipcode_ins,
          email_sal: req.body.email_ins,
          accountnumber_sal: req.body.accountnumber_ins,
          bank_sal: req.body.bank_ins,
          profile_sal: fileName.split("/").pop(),
          username_sal: req.body.username_ins,
          password_sal: req.body.password_ins,
          typeProduct_sal: req.body.typeProduct_ins,
          nameMarket_sal: req.body.nameMarket_ins,
        };
        const sql = "INSERT INTO membersaler SET ?";
        db.query(sql, classDataadd, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.send(results);
          }
        });
      }
    }
  });
});

membersale.put(
  "/updateSalemember",
  multer.single("avatar_update"),
  (req, res) => {
    if (!req.file) {
      // console.log(req.body.hoseNum_update);
      const id_sal = req.body.id_sal;
      const name_sal = req.body.name_update;
      const cardnumber_sal = req.body.cardnumber_update;
      const hoseNum_sal = req.body.hoseNum_update;
      const zipcode_sal = req.body.zipcode_update;
      const email_sal = req.body.email_update;
      const accountnumber_sal = req.body.accountnumber_update;
      const bank_sal = req.body.bank_update;

      const username_sal = req.body.username_update;
      const password_sal = req.body.password_update;
      const typeProduct_sal = req.body.typeProduct_update;
      const nameMarket_sal = req.body.nameMarket_update;
      db.query(
        "UPDATE membersaler SET name_sal=?, cardnumber_sal = ?, address_sal = ?,zipcode_sal = ?,email_sal=? ,accountnumber_sal =?,bank_sal=?,username_sal=?,password_sal=?,typeProduct_sal=?,nameMarket_sal=? WHERE id_sal  = ?",
        [
          name_sal,
          cardnumber_sal,
          hoseNum_sal,
          zipcode_sal,
          email_sal,
          accountnumber_sal,
          bank_sal,

          username_sal,
          password_sal,
          typeProduct_sal,
          nameMarket_sal,
          id_sal,
        ],
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } else {
      const file = bucket.file(`profile/${req.body.delete_profile}`);
      file.delete().then((downloadResponse) => {
        res.status(200).send(downloadResponse[0]);
      });
      const folder = "profile";
      const fileName = `${folder}/${Date.now() + "-" + req.file.originalname}`;
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      blobStream.end(req.file.buffer);
      const id_sal = req.body.id_sal;
      const name_sal = req.body.name_update;
      const cardnumber_sal = req.body.cardnumber_update;
      const hoseNum_sal = req.body.hoseNum_update;
      const zipcode_sal = req.body.zipcode_update;
      const accountnumber_sal = req.body.accountnumber_update;
      const bank_sal = req.body.bank_update;
      const profile_sal = fileName.split("/").pop();

      const username_sal = req.body.username_update;
      const password_sal = req.body.password_update;
      const typeProduct_sal = req.body.typeProduct_update;
      const nameMarket_sal = req.body.nameMarket_update;

      db.query(
        "UPDATE membersaler SET name_sal=?, cardnumber_sal = ?, address_sal = ?, zipcode_sal = ? ,accountnumber_sal =?,bank_sal=?,profile_sal=?,username_sal=?,password_sal=?,typeProduct_sal=?,nameMarket_sal=? WHERE id_sal  = ?",
        [
          name_sal,
          cardnumber_sal,
          hoseNum_sal,
          zipcode_sal,
          accountnumber_sal,
          bank_sal,
          profile_sal,

          username_sal,
          password_sal,
          typeProduct_sal,
          nameMarket_sal,
          id_sal,
        ],
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    }
  }
);

membersale.get("/getlocksale", (req, res) => {
  db.query("SELECT * FROM 	locksale", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
membersale.get("/getTypeproduct", (req, res) => {
  db.query("SELECT * FROM 	type_product", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

membersale.get("/delete_profile/:id", (req, res) => {
  const file = bucket.file(`profile/${req.params.id}`);
  file.delete().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
});
membersale.get("/memberSale", (req, res) => {
  db.query(
    `SELECT id_sal,name_sal,cardnumber_sal,address_sal,zipcode_sal,email_sal,accountnumber_sal,bank_sal,profile_sal,username_sal,password_sal,typeProduct_sal,nameMarket_sal,status_ban, if(status_ban = 1,"ปกติ","ถูกแบน") as name FROM membersaler;`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

membersale.delete("/deleteMembersaler/:id_sal", (req, res) => {
  const id_sal = req.params.id_sal;

  db.query("DELETE FROM membersaler WHERE id_sal =?", id_sal, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

membersale.put("/updateStatusbanl", (req, res) => {
  const status_ban = req.body.status_ban;
  const id_sal = req.body.id_sal;

  if (status_ban == 1) {
    db.query(
      "UPDATE membersaler SET status_ban = 0 WHERE id_sal =?",
      id_sal,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    db.query(
      "UPDATE membersaler SET status_ban = 1 WHERE id_sal =?",
      id_sal,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
});

module.exports = membersale;

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../../server_img/", "uploads"),
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// const uploadregister = multer({
//   storage: multer.memoryStorage({
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   }),
// });
