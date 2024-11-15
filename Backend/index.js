const express = require("express");
const app = express();
const cors = require("cors");
const post = process.env.port || 3001;
const user = require("./RouterWeb/userMember");
const typeProduct = require("./RouterWeb/typeProduct");
const lock = require("./RouterWeb/locksale");
const login = require("./RouterWeb/loginAdmin");
const memberSale = require("./RouterWeb/memberSaler");
const loadMarket = require("./RouterApp/loadMarket");
const Test = require("./RouterWeb/testuploadFike");
const loginMember = require("./RouterApp/loginMember");
const loginmembersal = require("./RouterApp/loginMemberSal");
const loadproduct_sal = require("./RouterApp/loadProduct_saler");
const insertProduct = require("./RouterApp/Product");
const lease = require("./RouterWeb/lease");
const order = require("./RouterApp/order");
const purchase = require("./RouterApp/purchase");
const insertUser = require("./RouterApp/insertUser");
const updateSale = require("./RouterApp/updateUserSale");
const reportMember = require("./RouterApp/reportMember");
const home = require("./RouterWeb/home");

app.listen(post, () => {
  console.log("server in run ning.  " + post);
});

app.use(cors());
app.use(express.json());
app.use(user);
app.use(login);
app.use(lock);
app.use(Test);
app.use(memberSale);
app.use(typeProduct);
app.use(lease);
app.use(home);

//---------------------------------------- app

app.use(loadMarket);
app.use(loginMember);
app.use(loginmembersal);
app.use(loadproduct_sal);
app.use(insertProduct);
app.use(order);
app.use(purchase);
app.use(insertUser);
app.use(updateSale);
app.use(reportMember);
