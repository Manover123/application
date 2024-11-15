const express = require("express");
const login = express.Router();
const db = require("../config/configData");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookiesParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

login.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
login.use(cookiesParser());
login.use(express.json());
login.use(bodyParser.urlencoded({ extended: true }));

login.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: "false",
    saveUninitialized: "false",
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

login.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

login.post("/registeradmin", (req, res) => {
  const username_adm = req.body.username;
  const password_adm = req.body.password;
  const email_adm = req.body.email;
  const name_adm = req.body.name;
  // const username_adm = "manover";
  // const password_adm = "KingHero321";
  // const email_adm = "noppadon@gmail.com";
  // const name_adm = "นพดล ใจปินตา";

  bcrypt.hash(password_adm, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO accounts_admin (username_adm,password_adm,email_adm,name_adm) VALUES(?,?,?,?)",
      [username_adm, hash, email_adm, name_adm],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("yo we need");
  } else {
    jwt.verify(token, "jwtsecret", (err, decoded) => {
      if (err) {
        res.json({ auth: true, message: "u failed" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

login.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("yo, u are");
});

login.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM accounts_admin WHERE username_adm =?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password_adm, (err, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({ id }, "jwtSecret", {
              expiresIn: 300,
            });
            req.session.user = result;
            res.json({ auth: true, token: token, result: result });
          } else {
            res.send({ message: "Wrong username/password" });
          }
        });
      } else {
        res.send({ message: "user dorsn't exit" });
      }
    }
  );
});

login.get("/admin/:userID", (req, res) => {
  const userID = req.params.userID;

  db.query(
    "SELECT * FROM accounts_admin WHERE id =?",
    userID,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// login.post("/loginAdmin", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   db.query(
//     "SELECT * FROM accounts_admin WHERE  	username_adm =? AND  password_adm=? ",
//     [username, password],
//     (err, result) => {
//       if (err) {
//         res.send({ err: err });
//       }
//       if (result.length > 0) {
//         res.send(result);
//       } else {
//         res.send({ message: "ไม่พบข้อมูล รหัสผ่านไม่ถูกต้อง.... " });
//       }
//     }
//   );
// });

module.exports = login;
