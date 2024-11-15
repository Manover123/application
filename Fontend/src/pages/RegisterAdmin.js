import React, { useEffect, useState } from "react";
import Axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../components/layout/authSlice";
import AppLayout from "../components/layout/AppLayout";
import { Multiselect } from "multiselect-react-dropdown";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DropDownList } from "@progress/kendo-react-dropdowns";

import "../App.scss";

const Testlogintoken = () => {
  const [usernameReg, setusernameReg] = useState("");
  const [passwordReg, setpasswordReg] = useState("");
  const [emailReg, setemailReg] = useState("");
  const [nameReg, setnameReg] = useState("");
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginstatus, setLoginstatus] = useState("");
  const navigate = useNavigate();
  const handleNavigate = (to) => {
    navigate(to, { replace: true });
  };

  const registerAddmin = () => {
    Axios.post("http://localhost:3001/registeradmin", {
      username: usernameReg,
      password: passwordReg,
      email: emailReg,
      name: nameReg,
    }).then((response) => {
      console.log(response);
      console.log(usernameReg);
      console.log(passwordReg);
      console.log(emailReg);
      console.log(nameReg);
    });
  };

  const [itemslock, setGetlock] = useState([]);
  const [dataLock, setDataLock] = useState("");

  const ChangeLocksale = (event) => {
    setDataLock(event.target.value);
    console.log(dataLock);
  };

  const onSelect = (selectedList, selectedItem) => {
    setData(selectedList);
  };
  const onRemove = (selectedList, removedItem) => {};
  const [data, setData] = useState("");
  const addlock = async () => {
    console.log(data);

    Axios.post("http://localhost:3001/testadd", {
      lockSale: data,
    }).then(function (result) {});
  };

  const getdatalock = async () => {
    Axios.get("http://localhost:3001/getlocksale", {}).then(function (result) {
      setGetlock(result.data);
    });
  };
  const [names, setnames] = useState({
    id: null,
    name: null,
  });

  const [state, setState] = useState([]);
  const addItemtoData = () => {
    setState([...state, names]);
    console.log(state);
    // console.log(names);
  };

  useEffect(() => {
    getdatalock();
  }, []);

  return (
    <AppLayout>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              border: "1px solid #b3b3b3",
              padding: 20,
              flexDirection: "column",
              borderRadius: 20,
            }}
          >
            <h1>เพิ่มสมาชิกแอดมิน</h1>

            <TextField
              label="ชื่อผู้เข้าใช้"
              variant="standard"
              onChange={(e) => setusernameReg(e.target.value)}
            />
            <TextField
              label="รหัสผ่าน"
              type={"password"}
              variant="standard"
              onChange={(e) => setpasswordReg(e.target.value)}
            />
            <TextField
              label="อีเมล"
              variant="standard"
              onChange={(e) => setemailReg(e.target.value)}
            />
            <TextField
              label="ชื่อ-นามสกุล"
              variant="standard"
              onChange={(e) => setnameReg(e.target.value)}
            />
            <br />
            <Button onClick={registerAddmin} variant="contained">
              บันทึก
            </Button>
          </div>
        </div>
        <br />
        <br />
      </div>
    </AppLayout>
  );
};

export default Testlogintoken;
