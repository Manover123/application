import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Insert from "@mui/icons-material/InsertDriveFile";
import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/Edit";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "react-data-table-component";
import customStyles from "./CustomStyles";
import ReportUser from "./DropDown/ReportUser";

import {
  SearchIcon,
  LockOpenIcon,
  AppBlockingTwoToneIcon,
  LockIcon,
  PhoneAndroidIcon,
} from "./icon";

export default function UserMember() {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenedit] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showuserMember, setShowUsermember] = useState([]);
  const [userData, setUserdata] = useState({
    id: "",
  });

  const [us_name, setus_name] = useState("");
  const [us_no, setus_no] = useState("");
  const [us_postalcode, setus_postalcode] = useState("");
  const [us_email, setus_email] = useState("");
  const [us_username, setus_username] = useState("");
  const [us_password, setus_password] = useState("");
  const [search, setSearch] = useState("");
  const [filteradCountries, setFilteradCountries] = useState([]);
  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: null,
  });
  const handleInputChange = (event) => {
    setuserInfo({
      ...userInfo,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    });
  };

  const register = () => {
    if (
      (us_name == "",
      us_no == "",
      us_postalcode == "",
      us_email == "",
      us_username == "",
      us_password == "",
      userInfo.file == "")
    ) {
      window.confirm("กรุณากรอกข้อมูลให้ครบ");
    } else {
      const check = showuserMember.filter(
        (val) => val.username_us === us_username
      );
      if (check.length === 0) {
        const formdataUser = new FormData();
        formdataUser.append("name_us", us_name);
        formdataUser.append("houseNumber_us", us_no);
        formdataUser.append("postalcode_us", us_postalcode);
        formdataUser.append("email_us", us_email);
        formdataUser.append("username_us", us_username);
        formdataUser.append("password_us", us_password);
        formdataUser.append("avatar", userInfo.file);
        Axios.post("http://localhost:3001/createUsermember", formdataUser, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
          console.log(response);
          loadUsermember();
          handleClose();
        });
      } else {
        window.alert("ชื่อผู้ใช่นี้มีอยู่เเล้ว");
      }
    }
  };
  const updateUser = () => {
    const check = showuserMember.filter(
      (val) => val.username_us === userData.username
    );
    if (check.length === 0) {
      const formdataUserUpdate = new FormData();
      formdataUserUpdate.append("id_us", userData.id);
      formdataUserUpdate.append("us_name", userData.name);
      formdataUserUpdate.append("us_no", userData.houseNumber);
      formdataUserUpdate.append("us_postalcode", userData.postalcode);
      formdataUserUpdate.append("us_email", userData.email);
      formdataUserUpdate.append("us_username", userData.username);
      formdataUserUpdate.append("us_password", userData.password);
      formdataUserUpdate.append("deleteProfile", userData.profile);
      formdataUserUpdate.append("avatar_update", userInfo.file);
      Axios.put("http://localhost:3001/update", formdataUserUpdate, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(() => {
        console.log(userData);
        handleClickcloseEdit();
        loadUsermember();
      });
    } else {
      window.alert("ชื่อผู้ใช่นี้มีอยู่เเล้ว");
    }
  };

  const loadUsermember = async () => {
    var response = fetch("http://localhost:3001/usermember")
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setShowUsermember(myJson);
        setFilteradCountries(myJson);
      });
  };

  useEffect(() => {
    loadUsermember();
  }, []);
  useEffect(() => {
    const result = showuserMember.filter((country) => {
      return country.name_us.toLowerCase().match(search.toLowerCase());
    });
    setFilteradCountries(result);
  }, [search]);

  const deleteUser = (id_us, profile_us) => {
    console.log(profile_us);
    Axios.delete(`http://localhost:3001/deleteuser/${id_us}`, {}).then(
      (response) => {
        setShowUsermember(
          showuserMember.filter((res) => {
            return res.id_us != id_us;
          })
        );
        loadUsermember();
      }
    );
    Axios.delete(`http://localhost:3001/delete_profileUser/${profile_us}`, {});
  };
  const deletImage = (id) => {
    Axios.get(`http://localhost:3001/delete_profileUser/${id}`).then(() => {
      console.log(id);
    });
  };
  const loaddata = (val) => {
    setOpenedit(true);
    console.log(val);
    setUserdata({
      id: val.id_us,
      name: val.name_us,
      houseNumber: val.address_us,
      postalcode: val.postalcode_us,
      email: val.email_us,
      username: val.username_us,
      password: val.password_us,
      profile: val.profile_us,
    });
  };
  const setUser = (val, params) => {
    const user = { ...userData };
    user[params] = val.target.value;
    setUserdata(user);
  };

  const showalertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickcloseEdit = () => {
    setOpenedit(false);
  };
  const Updatestatus_ban = (statusBan_us, id_us) => {
    Axios.put("http://localhost:3001/updateStatusbanl_us", {
      statusBan_us: statusBan_us,
      id_us: id_us,
    }).then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        // alert("อัพเดทสถานะสำเร็จ");
        loadUsermember();
        setOpenban(false);
      }
    });
  };
  const [indexShow, setIndexShow] = useState("");

  const [openban, setOpenban] = useState(false);
  const CheckStatususermember = () => {
    setOpenban(true);
  };

  const columns = [
    {
      name: "รหัสผู้ชื้อ",
      selector: (row) => row.id_us,
      sortable: true,
    },
    {
      name: "ชื่อ-นามสกุล",
      selector: (row) => row.name_us,
      sortable: true,
    },
    {
      name: "อีเมล",
      selector: (row) => row.email_us,
      sortable: true,
    },
    {
      name: "เบอร์โทร",
      selector: (row) => row.postalcode_us,
    },
    {
      name: "รูป",
      selector: (row) => (
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profileUser%2F${row.profile_us}?alt=media&token=926a6f49-3e73-4f26-9a53-24e74f84ac6c`}
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      name: "ชื่อผู้ใช้",
      selector: (row) => row.username_us,
    },
    {
      name: "แก้ไข",
      cell: (row) => (
        <div style={{ alignItems: "center" }}>
          <IconButton
            onClick={() => {
              loaddata(row);
            }}
            color="warning"
            aria-label="add to shopping cart"
          >
            <AddShoppingCartIcon />
          </IconButton>
          {/* <IconButton
            color="error"
            aria-label="add an alarm"
            onClick={() => {
              const confirmBox = window.confirm(
                "คุณต้องการลบข้อมูลของ        " + row.name_us
              );
              if (confirmBox === true) {
                deleteUser(row.id_us, row.profile_us);
                deletImage(row.profile_us);
              }
            }}
          >
            <AlarmIcon />
          </IconButton> */}
        </div>
      ),
    },
    {
      name: "สถานะใช้งาน",
      cell: (row, index) => {
        return (
          <div>
            <IconButton color="error" aria-label="add an alarm">
              {row.statusBan_us == 1 ? (
                <div
                  style={{
                    alignItems: "center",
                    width: 100,
                  }}
                >
                  <AppBlockingTwoToneIcon
                    className="Lockopen"
                    onClick={() => {
                      CheckStatususermember();
                      setIndexShow(index);
                    }}
                  />
                  <p style={{ fontSize: 12 }}>ถูกแบน</p>
                </div>
              ) : (
                <div style={{ alignItems: "center", width: 100 }}>
                  <PhoneAndroidIcon
                    className="unLock"
                    onClick={() => {
                      CheckStatususermember();
                      setIndexShow(index);
                    }}
                  />
                  <p style={{ fontSize: 12, color: "green" }}>ใช้งานได้ปกติ</p>
                </div>
              )}
              <div
                style={
                  openban && indexShow === index
                    ? {
                        position: "absolute",
                        zIndex: 100000,
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        marginRight: 140,
                      }
                    : {
                        position: "absolute",
                        visibility: "hidden",
                        zIndex: 100000,
                      }
                }
              >
                <div
                  style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    borderRadius: 20,
                    paddingBottom: 20,
                    boxShadow: "1px 3px 1px #9E9E9E",
                  }}
                >
                  {row.statusBan_us == 1 ? (
                    <div
                      style={{
                        width: 130,
                        padding: 3,
                      }}
                    >
                      <div style={{}}>
                        <Button
                          onClick={() => {
                            setOpenban(false);
                            console.log(openban);
                          }}
                        >
                          ปิด
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<LockOpenIcon />}
                          size="small"
                          color="success"
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "คุณต้องการที่จะปลดแบบผู้ใช้     " +
                                row.name_us +
                                " หรือไม่"
                            );
                            if (confirmBox === true) {
                              Updatestatus_ban(row.statusBan_us, row.id_us);
                            } else {
                              setOpenban(false);
                            }
                          }}
                        >
                          ปลดแบน
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 130,
                        padding: 7,
                      }}
                    >
                      <div style={{}}>
                        <Button
                          onClick={() => {
                            setOpenban(false);
                            console.log(openban);
                          }}
                        >
                          ปิด
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<LockIcon />}
                          size="small"
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "คุณต้องการแบบการใช้งานของคุณ     " +
                                row.name_us +
                                " หรือไม่"
                            );
                            if (confirmBox === true) {
                              Updatestatus_ban(row.statusBan_us, row.id_us);
                            } else {
                              setOpenban(false);
                            }
                          }}
                        >
                          แบน
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="content">
        <br />
        <div
          style={{
            display: "flex",

            flexDirection: "row",
            position: "absolute",
            zIndex: 100,
          }}
        >
          <Button
            onClick={handleClickOpen}
            variant="contained"
            color="success"
            endIcon={<Insert />}
          >
            เพิ่มข้อมูลผู้ชื้อ
          </Button>
          <ReportUser data={filteradCountries} />
        </div>

        <br />

        <br />
        <div
          style={{
            height: "auto",
          }}
        >
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={filteradCountries}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="400px"
            subHeader
            subHeaderComponent={
              <Paper
                component="form"
                sx={{
                  p: "1px 2px",
                  display: "flex",
                  alignItems: "center",
                  width: 250,

                  border: "1px solid #b3b3b3",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="ค้นหาด้วยชื่อ"
                  inputProps={{ "aria-label": "search google maps" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <SearchIcon className="ColorIconseach" />
              </Paper>
            }
            subHeaderAlign={"right"}
          />
        </div>
        <div>
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"เพิ่มข้อมูลผู้ชื้อ"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="standard-basic"
                    label="ชื่อ-นามสกุล"
                    variant="standard"
                    onChange={(e) => setus_name(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="ที่อยู่"
                    variant="standard"
                    onChange={(e) => setus_no(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="เบอร์โทร"
                    variant="standard"
                    onChange={(e) => setus_postalcode(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="อีเมล"
                    variant="standard"
                    onChange={(e) => setus_email(e.target.value)}
                  />
                  <p>รูปประจำตัว</p>
                  <div
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      backgroundColor: "#d9d9d9",
                    }}
                  >
                    <input
                      type={"file"}
                      style={{}}
                      onChange={handleInputChange}
                    />

                    {userInfo.filepreview !== null ? (
                      <img
                        style={{ width: 150, height: 150 }}
                        src={userInfo.filepreview}
                        alt="UploadImage"
                      />
                    ) : null}
                  </div>
                  <TextField
                    id="standard-basic"
                    label="ชื่อผู้ใช้"
                    variant="standard"
                    onChange={(e) => setus_username(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="รหัสผ่าน"
                    variant="standard"
                    onChange={(e) => setus_password(e.target.value)}
                  />
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={register} variant="contained" endIcon={<Save />}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog
            fullScreen={fullScreen}
            open={openEdit}
            onClose={handleClickcloseEdit}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">{"แก้ไข"}</DialogTitle>
            {userData && (
              <DialogContent>
                <DialogContentText>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label="ชื่อ-นามสกุล"
                      variant="standard"
                      defaultValue={userData.name}
                      onChange={(val) => setUser(val, "name")}
                    />

                    <TextField
                      id="standard-basic"
                      label="ที่อยู๋"
                      variant="standard"
                      defaultValue={userData.houseNumber}
                      onChange={(val) => setUser(val, "houseNumber")}
                    />
                    <p>รูปประจำตัว</p>
                    <div
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#d9d9d9",
                      }}
                    >
                      <input
                        type={"file"}
                        style={{}}
                        onChange={handleInputChange}
                      />

                      {userInfo.filepreview !== null ? (
                        <img
                          style={{ width: 150, height: 150 }}
                          src={userInfo.filepreview}
                          alt="UploadImage"
                        />
                      ) : null}
                    </div>

                    <TextField
                      id="standard-basic"
                      label="เบอร์โทร"
                      variant="standard"
                      defaultValue={userData.postalcode}
                      onChange={(val) => setUser(val, "postalcode")}
                    />
                    <TextField
                      id="standard-basic"
                      label="อีเมล"
                      variant="standard"
                      defaultValue={userData.email}
                      onChange={(val) => setUser(val, "email")}
                    />
                    <TextField
                      id="standard-basic"
                      label="ชื่อผู้ใช้"
                      variant="standard"
                      defaultValue={userData.username}
                      onChange={(val) => setUser(val, "username")}
                    />
                    {/* <TextField
                      id="standard-basic"
                      label="รหัสผ่าน"
                      variant="standard"
                      defaultValue={userData.password}
                      onChange={(val) => setUser(val, "password")}
                    /> */}
                  </Box>
                </DialogContentText>
              </DialogContent>
            )}

            <DialogActions>
              <Button
                onClick={() => updateUser()}
                variant="contained"
                endIcon={<SendIcon />}
              >
                แก้ไข
              </Button>
              <Button
                onClick={handleClickcloseEdit}
                variant="contained"
                color="error"
              >
                ยกเลิก
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  );
}
