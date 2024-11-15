import axios from "axios";
import React from "react";

import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../components/layout/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleNavigate = (to) => {
    navigate(to, { replace: true });
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginstatus, setLoginstatus] = useState("");
  const type = useSelector((state) => state.auth.nameTypes);

  const Login = () => {
    axios
      .post("http://localhost:3001/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (!response.data.auth) {
          setLoginstatus("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } else {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("id", response.data.result[0].id);
          dispatch(setUser({ user: response.data.result[0].name_adm }));
          handleNavigate("/");
          setLoginstatus(response.data.result[0].name_adm);
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "left",
        width: "100%",
        height: "100%",
        backgroundColor: "#dc007a",
      }}
    >
      <div className="inner">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>เข้าสู่ระบบ</h1>
          <TextField
            id="standard-basic"
            label="username"
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="standard-basic"
            label="password"
            type={"password"}
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button onClick={Login} variant="contained">
            ยืนยัน
          </Button>
          <br />
          <h6 style={{ color: "red" }}>{loginstatus}</h6>
        </div>
      </div>
    </div>
  );
};

export default Login;
