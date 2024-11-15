import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef } from "react";
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
import IconDelete from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import Insert from "@mui/icons-material/InsertDriveFile";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/Edit";
import ReportUser from "./DropDown/ReportUser";
import {
  SearchIcon,
  LockOpenIcon,
  AppBlockingTwoToneIcon,
  LockIcon,
  PhoneAndroidIcon,
} from "./icon";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import AppLayout from "../components/layout/AppLayout";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import DataTable from "react-data-table-component";
import customStyles from "./CustomStyles";
import "./styles.css";

const Salemember = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenedit] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [membersale, setShowmemberSale] = useState([]);
  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: null,
  });

  const [name_ins_sal, setname_ins_sal] = useState("");
  const [cardnumber_ins_sal, setcardnumber_ins_sal] = useState("");
  const [hoseNum_ins_sal, sethoseNum_ins_sal] = useState("");
  const [zipcode_ins_sal, setzipcode_ins_sal] = useState("");
  const [email_ins_sal, setemail_ins_sal] = useState("");
  const [accountnumber_ins_sal, setaccountnumber_ins_sal] = useState("");
  const [bank_ins_sal, setbank_ins_sal] = useState("");
  const [typeProduct_ins_sal, setTypeProduct_ins_sal] = useState("");
  const [nameMarket_ins_sal, setNameMarket_ins_sal] = useState("");
  const [username_ins_sal, setusername_ins_sal] = useState("");
  const [password_ins_sal, setpassword_ins_sal] = useState("");
  const [search, setSearch] = useState("");
  const [filteradCountries, setFilteradCountries] = useState([]);

  const [itemsType, setGetType] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickcloseEdit = () => {
    setOpenedit(false);
  };

  const handleInputChange = (event) => {
    setuserInfo({
      ...userInfo,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    });
  };
  const registerMember = (event) => {
    if (
      (name_ins_sal == "",
      cardnumber_ins_sal == "",
      hoseNum_ins_sal == "",
      zipcode_ins_sal == "",
      email_ins_sal == "",
      username_ins_sal == "",
      password_ins_sal == "",
      nameMarket_ins_sal == "",
      accountnumber_ins_sal == "",
      bank_ins_sal == "",
      userInfo.file == "")
    ) {
      window.confirm("กรุณากรอกข้อมูลให้ครบ");
    } else {
      event.preventDefault();
      const sale = "sale";
      const userNameMember = sale + username_ins_sal;
      const check = membersale.filter(
        (val) => val.username_sal === userNameMember
      );
      const checkCardnumber = membersale.filter(
        (val) => val.cardnumber_sal === cardnumber_ins_sal
      );
      if (check.length === 0) {
        if (checkCardnumber.length === 0) {
          const formdata = new FormData();
          formdata.append("avatar", userInfo.file);
          formdata.append("name_ins", name_ins_sal);
          formdata.append("cardnumber_ins", cardnumber_ins_sal);
          formdata.append("hoseNum_ins", hoseNum_ins_sal);
          formdata.append("zipcode_ins", zipcode_ins_sal);
          formdata.append("email_ins", email_ins_sal);
          formdata.append("accountnumber_ins", accountnumber_ins_sal);
          formdata.append("bank_ins", bank_ins_sal);
          formdata.append("username_ins", userNameMember);
          formdata.append("password_ins", password_ins_sal);
          formdata.append("typeProduct_ins", typeProduct_ins_sal);
          formdata.append("nameMarket_ins", nameMarket_ins_sal);
          Axios.post("http://localhost:3001/registerMembersale", formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          }).then(() => {
            loadmemberSale();
            handleClose();
          });
        } else {
          window.alert("รหัสบัตรประชาชนช้ำกัน");
        }
      } else {
        window.alert("ชื่อผู้ใช่นี้มีอยู่เเล้ว");
      }
    }
  };
  const deleteUser = (id_sal) => {
    Axios.delete(`http://localhost:3001/deleteMembersaler/${id_sal}`).then(
      (response) => {
        setShowmemberSale(
          membersale.filter((res) => {
            return res.id_sal != id_sal;
          })
        );
        handleClickcloseEdit();
        loadmemberSale();
      }
    );
  };

  const deletImage = (id) => {
    Axios.get(`http://localhost:3001/delete_profile/${id}`).then(() => {
      console.log(id);
    });
  };

  // const getdatalock = async () => {
  //   Axios.get("http://localhost:3001/getlocksale", {}).then(function (result) {
  //     setGetlock(result.data);
  //   });
  // };
  const getTypeproduct = async () => {
    Axios.get("http://localhost:3001/getTypeproduct", {}).then(function (
      result
    ) {
      setGetType(result.data);
    });
  };

  const loadmemberSale = async () => {
    var response = fetch("http://localhost:3001/memberSale")
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setShowmemberSale(myJson);
        setFilteradCountries(myJson);
      });
  };

  const [image, setImage] = useState("");

  useEffect(() => {
    getTypeproduct();
    loadmemberSale();
  }, []);
  useEffect(() => {
    const result = membersale.filter((country) => {
      return country.name_sal.toLowerCase().match(search.toLowerCase());
    });
    setFilteradCountries(result);
  }, [search]);

  const [userData, setUserdata] = useState({
    id: "",
  });
  const loaddata = (val) => {
    setOpenedit(true);
    setUserdata({
      id: val.id_sal,
      namesal: val.name_sal,
      cardnumber: val.cardnumber_sal,
      hoseNum: val.address_sal,
      zipcode: val.zipcode_sal,
      email: val.email_sal,
      accountnumber: val.accountnumber_sal,
      bank: val.bank_sal,
      profile: val.profile_sal,
      username: val.username_sal,
      password: val.password_sal,
      typeProduct: val.typeProduct_sal,
      nameMarket: val.nameMarket_sal,
    });
  };

  const setUser = (val, params) => {
    const user = { ...userData };
    user[params] = val.target.value;
    setUserdata(user);
  };

  const updateUser = () => {
    const check = membersale.filter(
      (val) => val.username_sal === userData.username
    );
    if (check.length === 0) {
      const formdataUpdate = new FormData();
      formdataUpdate.append("id_sal", userData.id);
      formdataUpdate.append("name_update", userData.namesal);
      formdataUpdate.append("cardnumber_update", userData.cardnumber);
      formdataUpdate.append("hoseNum_update", userData.hoseNum);
      formdataUpdate.append("zipcode_update", userData.zipcode);
      formdataUpdate.append("email_update", userData.email);
      formdataUpdate.append("accountnumber_update", userData.accountnumber);
      formdataUpdate.append("bank_update", userData.bank);
      formdataUpdate.append("avatar_update", userInfo.file);
      formdataUpdate.append("username_update", userData.username);
      formdataUpdate.append("password_update", userData.password);
      formdataUpdate.append("typeProduct_update", userData.typeProduct);
      formdataUpdate.append("nameMarket_update", userData.nameMarket);
      formdataUpdate.append("delete_profile", userData.profile);
      Axios.put(
        "http://localhost:3001/updateSalemember",
        formdataUpdate,
        {}
      ).then(() => {
        console.log(userData);
        handleClickcloseEdit();
        loadmemberSale();
      });
    } else {
      window.alert("ชื่อผู้ใช่นี้มีอยู่เเล้ว");
    }
  };

  const [indexShow, setIndexShow] = useState("");

  const [openban, setOpenban] = useState(false);
  const CheckStatususermember = () => {
    setOpenban(true);
  };

  //const wrap = useRef(null);

  const Updatestatus_ban = (status_ban, id_sal) => {
    console.log(status_ban, id_sal);
    Axios.put("http://localhost:3001/updateStatusbanl", {
      status_ban: status_ban,
      id_sal: id_sal,
    }).then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        // alert("อัพเดทสถานะสำเร็จ");
        loadmemberSale();
        setOpenban(false);
      }
    });
  };

  const columns = [
    {
      name: "รหัสผู้ขาย",
      selector: (row) => row.id_sal,
      sortable: true,
    },
    {
      name: "ชื่อ-นามสกุล",
      selector: (row) => row.name_sal,
      sortable: true,
    },
    {
      name: "อีเมล",
      selector: (row) => row.email_sal,
      sortable: true,
    },
    {
      name: "เบอร์โทร",
      selector: (row) => row.zipcode_sal,
    },
    {
      name: "รูป",
      selector: (row) => (
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/hotel-5d504.appspot.com/o/profile%2F${row.profile_sal}?alt=media&token=689c880e-a865-4f6a-883a-d578a4e330cb`}
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      name: "ชื่อผู้ใช้",
      selector: (row) => row.username_sal,
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
        </div>
      ),
    },
    {
      name: "สถานะใช้งาน",
      cell: (row, index) => {
        return (
          <div>
            <IconButton color="error" aria-label="add an alarm">
              {row.status_ban == 1 ? (
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
                  {row.status_ban == 1 ? (
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
                                row.name_sal +
                                " หรือไม่"
                            );
                            if (confirmBox === true) {
                              Updatestatus_ban(row.status_ban, row.id_sal);
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
                                row.name_sal +
                                " หรือไม่"
                            );
                            if (confirmBox === true) {
                              Updatestatus_ban(row.status_ban, row.id_sal);
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
      <br />
      <div className="content">
        <div
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        ></div>
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
            เพิ่มข้อมูลผู้ขาย
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
                    onChange={(e) => setname_ins_sal(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="เลขบัตรประชาชน"
                    variant="standard"
                    onChange={(e) => setcardnumber_ins_sal(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="ที่อยู่"
                    variant="standard"
                    onChange={(e) => sethoseNum_ins_sal(e.target.value)}
                  />

                  <TextField
                    id="standard-basic"
                    label="เบอร์โทร"
                    variant="standard"
                    onChange={(e) => setzipcode_ins_sal(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="อีเมล"
                    variant="standard"
                    type="email"
                    onChange={(e) => setemail_ins_sal(e.target.value)}
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
                    onChange={(e) => setusername_ins_sal(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="รหัสผ่าน"
                    variant="standard"
                    onChange={(e) => setpassword_ins_sal(e.target.value)}
                  />
                  <br />
                  <DialogTitle>{"ข้อมูลรายละเอียดร้าน"}</DialogTitle>
                  <TextField
                    id="standard-basic"
                    label="ชื่อร้าน"
                    variant="standard"
                    onChange={(e) => setNameMarket_ins_sal(e.target.value)}
                  />
                  {/* <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <select
                      style={{ height: 40, marginLeft: 8 }}
                      onChange={(e) => setTypeProduct_ins_sal(e.target.value)}
                    >
                      <option>ประเภทสินค้า</option>
                      {itemsType.map((val) => (
                        <option>{val.name_product}</option>
                      ))}
                    </select>
                  </div> */}
                  <TextField
                    id="standard-basic"
                    label="เลขบัญชีธนาคาร"
                    variant="standard"
                    onChange={(e) => setaccountnumber_ins_sal(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    label="ธนาคาร"
                    variant="standard"
                    onChange={(e) => setbank_ins_sal(e.target.value)}
                  />
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                endIcon={<Save />}
                onClick={registerMember}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          {userData && (
            <Dialog
              fullScreen={fullScreen}
              open={openEdit}
              onClose={handleClickcloseEdit}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">{"แก้ไข"}</DialogTitle>

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
                      defaultValue={userData.namesal}
                      onChange={(val) => setUser(val, "namesal")}
                    />
                    <TextField
                      id="standard-basic"
                      label="เลขบัตรประชาชน"
                      variant="standard"
                      defaultValue={userData.cardnumber}
                      onChange={(val) => setUser(val, "cardnumber")}
                    />
                    <TextField
                      id="standard-basic"
                      label="ที่อยู่"
                      variant="standard"
                      defaultValue={userData.hoseNum}
                      onChange={(val) => setUser(val, "hoseNum")}
                    />

                    <TextField
                      id="standard-basic"
                      label="เบอร์โทร"
                      variant="standard"
                      defaultValue={userData.zipcode}
                      onChange={(val) => setUser(val, "zipcode")}
                    />
                    <TextField
                      id="standard-basic"
                      label="อีเมล"
                      variant="standard"
                      defaultValue={userData.email}
                      onChange={(val) => setUser(val, "email")}
                    />

                    <p>รูปประจำตัว</p>

                    <div
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#d9d9d9",
                      }}
                    >
                      <input type="file" onChange={handleInputChange} />
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
                    <DialogTitle>{"ข้อมูลรายละเอียดร้าน"}</DialogTitle>
                    <TextField
                      id="standard-basic"
                      label="ชื่อร้าน"
                      variant="standard"
                      defaultValue={userData.nameMarket}
                      onChange={(val) => setUser(val, "nameMarket")}
                    />
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <select
                        style={{ height: 40, marginLeft: 8 }}
                        onChange={(val) => setUser(val, "typeProduct")}
                      >
                        <option>ประเภทสินค้า</option>
                        {itemsType.map((val) => (
                          <option>{val.name_product}</option>
                        ))}
                      </select>
                    </div> */}
                    <TextField
                      id="standard-basic"
                      label="เลขบัญชีธานคาร"
                      variant="standard"
                      defaultValue={userData.accountnumber}
                      onChange={(val) => setUser(val, "accountnumber")}
                    />
                    <TextField
                      id="standard-basic"
                      label="ธานคาร"
                      variant="standard"
                      defaultValue={userData.bank}
                      onChange={(val) => setUser(val, "bank")}
                    />
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => updateUser()}
                >
                  แก้ไข
                </Button>

                {/* <Button
                  variant="contained"
                  endIcon={<IconDelete />}
                  color="error"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      "คุณต้องการลบข้อมูลของ        " + userData.namesal
                    );

                    if (confirmBox === true) {
                      const id_usale = userData.id;
                      const id = userData.profile;

                      deletImage(id);
                      deleteUser(id_usale);
                    }
                  }}
                >
                  ลบ
                </Button> */}

                <Button
                  onClick={handleClickcloseEdit}
                  variant="contained"
                  color="warning"
                >
                  ยกเลิก
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Salemember;
