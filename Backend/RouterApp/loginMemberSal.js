const express = require("express");
const loginMemberSal = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

loginMemberSal.use(cors());
loginMemberSal.use(express.json());

loginMemberSal.post("/loginMemberSal", (req, res) => {
  const username_sal = req.body.username;
  const password_sal = req.body.password;
  db.query(
    "SELECT * FROM membersaler WHERE  username_sal =? AND password_sal=? ",
    [username_sal, password_sal],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
        // console.log(username_us);
        // console.log(result);
      } else {
        res.send({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.... " });
      }
    }
  );
});
module.exports = loginMemberSal;
