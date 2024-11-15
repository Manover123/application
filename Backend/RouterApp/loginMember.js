const express = require("express");
const loginMember = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParsr = require("body-parser");

loginMember.use(cors());
loginMember.use(express.json());

loginMember.post("/loginMember", (req, res) => {
  const username_us = req.body.username;
  const password_us = req.body.password;
  db.query(
    "SELECT * FROM usermember WHERE  username_us =? AND password_us=? ",
    [username_us, password_us],
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
module.exports = loginMember;
