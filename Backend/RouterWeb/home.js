const express = require("express");
const home = express.Router();
const db = require("../config/configData");
const cors = require("cors");

home.use(cors());
home.use(express.json());

home.get("/LoadUserSum", (req, res) => {
  db.query(
    "SELECT  COUNT(statusBan_us) as UserTotol ,COUNT(IF(statusBan_us = '1', 1, NULL)) AS Ban,COUNT(IF(statusBan_us = '0', 0, NULL))AS open  FROM usermember;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
home.get("/LoadMembersaleSum", (req, res) => {
  db.query(
    "SELECT  COUNT(name_sal) AS MemberSum , COUNT(IF(status_ban = '0',0,null))AS MemberOpen  ,COUNT(IF(status_ban ='1',1,null)) AS MemberBan     FROM membersaler;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
home.get("/LoadLocksaleStatus", (req, res) => {
  db.query(
    "SELECT COUNT(name_lock) AS lockSum , COUNT(IF(status ='0',0,null)) AS hire ,COUNT(IF(status ='1',1,null)) AS free   FROM locksale;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = home;
