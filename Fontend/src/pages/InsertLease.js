import React, { useState, useEffect } from "react";
import axios from "axios";
import AppLayout from "../components/layout/AppLayout";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/Delete";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Insert from "@mui/icons-material/InsertDriveFile";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import AddShoppingCartIcon from "@mui/icons-material/Edit";
import DataTable from "react-data-table-component";
import { SearchIcon } from "./icon";
import customStyles from "./CustomStyles";
import ReportUser from "./DropDown/ReportUser";

import { format } from "date-fns";

const TestFirbase = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openinsert, setOpeninsert] = useState(false);

  const handleClickOpeninsert = () => {
    setOpeninsert(true);
  };

  const handleCloseinsert = () => {
    setOpeninsert(false);
  };
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const [datalease, setLease] = useState([]);

  const [dateNow, setdateNow] = useState(null);
  const [dateEnd, setdateEnd] = useState(null);
  const [idLock, setidLock] = useState(null);

  const [date_Now, setDateNow] = useState(null);
  const [date_End, setDateEnd] = useState(null);
  const [idmember, setID] = useState(null);
  const [typeProduct_ins_sal, setTypeProduct_ins_sal] = useState("");
  const [typeProduct_update, setTypeProduct_update] = useState("");
  const [locksale, setLocksale] = useState([]);
  const [id_lock, setid_lock] = useState("");
  const [nameGivelock, setNameGivelock] = useState("");
  const [nameLock, setNameLock] = useState("");

  const [text1, setIDtext1] = useState("");
  const [text2, setIDtext2] = useState("");
  const [text3, setIDtext3] = useState("");
  const [text4, setIDtext4] = useState("");
  const [text5, setIDtext5] = useState("");

  const [search, setSearch] = useState("");
  const [filteradCountries, setFilteradCountries] = useState([]);

  const [itemsType, setGetType] = useState([]);

  const [Reserve, setReserve] = useState([]);
  const deleteLease = (id_lock) => {
    axios
      .get(`http://localhost:3001/deleteLease/${id_lock}`, {})
      .then((res) => {
        if (res) {
          console.log(res);
          loadLease();
        }
      });
  };
  const loadLease = () => {
    axios.get("http://localhost:3001/getDatalease", {}).then((res, err) => {
      if (res) {
        setLease(res.data);
        setFilteradCountries(res.data);
      } else {
        console.log(err);
      }
    });
  };
  const loaddata = (val) => {
    console.log(val);
    setdateNow(val.dateNow);
    setdateEnd(val.dateEnd);
    setidLock(val.id_lock);
    setTypeProduct_update(val.typeProduct);
    handleClickOpenEdit();
  };
  const updateTimelease = () => {
    console.log(idLock);
    console.log(dateNow);
    console.log(dateEnd);
    console.log(typeProduct_update);

    axios
      .put("http://localhost:3001/updateTimelease", {
        dateNowEdit:
          dateNow.getUTCMonth() +
          1 +
          "/" +
          dateNow.getDate() +
          "/" +
          dateNow.getFullYear(),
        dateEndEdit:
          dateEnd.getUTCMonth() +
          1 +
          "/" +
          dateEnd.getDate() +
          "/" +
          dateEnd.getFullYear(),
        typeProduct: typeProduct_update,
        id_lock: idLock,
      })
      .then((res) => {
        handleCloseEdit();
        loadLease();
      });
  };

  const load_locksale = () => {
    axios.get("http://localhost:3001/locksale", {}).then((res, err) => {
      if (res) {
        setLocksale(res.data);
      } else {
        console.log(err);
      }
    });
  };

  const loadIDlock = (id_lock) => {
    setNameLock(id_lock);
    axios
      .get(`http://localhost:3001/loaddataIDlock/${id_lock}`, {})
      .then((res, err) => {
        if (res) {
          setid_lock(res.data[0].id_lock);
        } else {
          console.log(err);
        }
      });
  };
  const getTypeproduct = async () => {
    axios
      .get("http://localhost:3001/getTypeproduct", {})
      .then(function (result) {
        setGetType(result.data);
      });
  };

  const loadMemberByid = (id) => {
    axios
      .get(`http://localhost:3001/loadmeMbersalerByids/${id}`, {})
      .then((res, err) => {
        if (res) {
          setIDtext1(res.data[0].name_sal);
          setIDtext2(res.data[0].cardnumber_sal);
          setIDtext3(res.data[0].address_sal);
          setIDtext4(res.data[0].id_sal);
          setIDtext5(res.data[0].zipcode_sal);
        } else {
          console.log(err);
        }
      });
  };

  const insertLease = () => {
    axios
      .post("http://localhost:3001/insertLease", {
        data: Reserve,
      })
      .then((res, err) => {
        if (res) {
          console.log(res);
          window.location.reload();
        } else {
          console.log(err);
        }
      });
  };

  const getdataFrom = () => {
    if (Reserve.some((el) => el.id_lock === id_lock)) {
      setOpen(true);
    } else {
      const data = {
        id_sal: text4,
        id_lock: id_lock,
        name_lock: nameLock,
        nameGive_lock: nameGivelock,
        typeProduct: typeProduct_ins_sal,
        dateNow:
          date_Now.getUTCMonth() +
          1 +
          "/" +
          date_Now.getDate() +
          "/" +
          date_Now.getFullYear(),
        dateEnd:
          date_End.getUTCMonth() +
          1 +
          "/" +
          date_End.getDate() +
          "/" +
          date_End.getFullYear(),
      };
      setReserve([...Reserve, data]);
      console.log(Reserve);
    }
  };

  const deleteRow = (id) => {
    setReserve(
      Reserve.filter((value) => {
        return value.id_lock !== id;
      })
    );
  };
  useEffect(() => {
    // console.log(Reserve);
    getTypeproduct();
    load_locksale();
    loadLease();
  }, []);

  useEffect(() => {
    const result = datalease.filter((country) => {
      return country.name_lock.toLowerCase().match(search.toLowerCase());
    });
    setFilteradCountries(result);
  }, [search]);

  const columns = [
    {
      name: "รหัสผู้ขาย",
      selector: (row) => row.id_sal,
      sortable: true,
    },
    {
      name: "รหัสล็อก",
      selector: (row) => row.id_lock,
      sortable: true,
    },
    {
      name: "ชื่อล็อก",
      selector: (row) => row.name_lock,
      sortable: true,
    },
    {
      name: "ประเภทสินค้า",
      selector: (row) => row.typeProduct,
    },

    {
      name: "วันเริ่มสัญญา",
      selector: (row) => row.dateNow,
    },
    {
      name: "วันหมดสัญญา",
      selector: (row) => row.dateEnd,
    },
    {
      name: "แก้ไข",
      cell: (row) => (
        <div>
          <IconButton
            onClick={() => {
              loaddata(row);
            }}
            color="warning"
            aria-label="add to shopping cart"
          >
            <AddShoppingCartIcon />
          </IconButton>
          <IconButton
            color="error"
            aria-label="add an alarm"
            onClick={() => {
              const confirmBox = window.confirm(
                "คุณต้องการลบข้อมูลของ        " + row.name_lock
              );
              if (confirmBox === true) {
                deleteLease(row.id_lock);
              }
            }}
          >
            <AlarmIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <br />

        <div
          style={{
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",

              flexDirection: "row",
              position: "absolute",
              zIndex: 100,
            }}
          >
            <Button
              onClick={handleClickOpeninsert}
              variant="contained"
              color="success"
              endIcon={<Insert />}
            >
              เพิ่มข้อมูลสัญญาเช่าล็อค
            </Button>
            <ReportUser data={filteradCountries} />
          </div>
        </div>
        <br />
        <div
          style={{
            alignItems: "center",

            width: "100%",
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
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ล็อคมีอยู่เเล้ว กรุณเลือกอันใหม่"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ตกลง</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openinsert}
        onClose={handleCloseinsert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"แบบฟอร์มสัญญาเช่าล็อค"}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              // backgroundColor: "green",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                // backgroundColor: "yellow",
                flexDirection: "column",
                marginTop: 20,
              }}
            >
              <Stack spacing={2} direction="row">
                <TextField
                  size="small"
                  label="รหัสบัตรประชาชน"
                  variant="outlined"
                  onChange={(e) => setID(e.target.value)}
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => loadMemberByid(idmember)}
                >
                  โหลดข้อมูลผู้ขาย
                </Button>
              </Stack>
              <div
                style={{
                  flexDirection: "row-reverse",
                  marginTop: 20,
                }}
              >
                <Stack spacing={1} direction="row">
                  <TextField
                    size="small"
                    label="ชื่อ"
                    variant="outlined"
                    value={text1}
                    disabled
                  />

                  <TextField
                    size="small"
                    label="ที่อยู่"
                    variant="outlined"
                    value={text3}
                    disabled
                  />
                </Stack>
              </div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <Stack spacing={1} direction="row">
                  <TextField
                    size="small"
                    label="เลขไอดี"
                    variant="outlined"
                    value={text4}
                    disabled
                  />
                  <TextField
                    size="small"
                    label="เบอร์โทร"
                    variant="outlined"
                    value={text5}
                    disabled
                  />
                </Stack>
              </div>
              <br />
              <Stack spacing={1} direction="row">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="วันเริ่มสัญญา"
                    value={date_Now}
                    format="mm/dd/yyyy"
                    onChange={(newValue) => {
                      {
                        setDateNow(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="วันหมดสัญญา"
                    value={date_End}
                    format="mm/dd/yyyy"
                    onChange={(endValue) => {
                      {
                        setDateEnd(endValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Stack>
              <br />
              <Stack spacing={2} direction="row">
                <select
                  style={{ height: 40 }}
                  onChange={(e) => {
                    loadIDlock(e.target.value);
                  }}
                >
                  <option>เลือกล็อกขาย</option>
                  {locksale.map((val) => (
                    <option>{val.name_lock}</option>
                  ))}
                </select>
                <div
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
                </div>
                <TextField
                  size="small"
                  label="ไอดีล็อค"
                  variant="outlined"
                  value={id_lock}
                />
                <TextField
                  size="small"
                  label="ชื่อผู้ให้เช่า"
                  variant="outlined"
                  onChange={(e) => setNameGivelock(e.target.value)}
                />
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={getdataFrom}
                >
                  ยื่นยัน
                </Button>
              </Stack>
            </div>
            <br />
            <div
              style={{
                alignItems: "center",
                marginTop: 2,
                display: "flex",
              }}
            >
              <table
                className="table table-striped"
                style={{ overflowY: "scroll" }}
              >
                <thead
                  style={{
                    backgroundColor: "#ffe6ee",
                    textAlign: "center",
                    height: 45,
                  }}
                >
                  <tr
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    <th scope="col">รหัสผู้ขาย</th>
                    <th scope="col">รหัสล็อก</th>
                    <th scope="col">ชื่อล็อก</th>
                    <th scope="col">ชื่อผู้ให้เช่า</th>
                    <th scope="col">วันเริ่มสัญญา</th>
                    <th scope="col">วันหมดสัญญา</th>
                    <th scope="col">ลบ</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {Reserve.map((val) => (
                    <tr>
                      <td>{val.id_sal}</td>
                      <td>{val.id_lock}</td>
                      <td>{val.name_lock}</td>
                      <td>{val.nameGive_lock}</td>
                      <td>{val.dateNow}</td>
                      <td>{val.dateEnd}</td>
                      <td>
                        <IconButton
                          color="error"
                          aria-label="add an alarm"
                          onClick={() => {
                            const confirmBox = window.confirm(
                              "คุณต้องการลบข้อมูลของ        " + val.id_lock
                            );
                            if (confirmBox === true) {
                              deleteRow(val.id_lock);
                            }
                          }}
                        >
                          <AlarmIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="contained" color="success" onClick={insertLease}>
              บันทึกลงฐานข้อมูล
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseinsert}>ออก</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"แก้ไขวันเวลาสัญญา"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <br />
            <Stack spacing={2} direction="row">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="วันเริ่มสัญญา"
                  value={dateNow}
                  onChange={(newValue) => {
                    {
                      setdateNow(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="วันหมดสัญญา"
                  value={dateEnd}
                  onChange={(endValue) => {
                    {
                      setdateEnd(endValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <select
                  style={{ height: 40, marginLeft: 8 }}
                  onChange={(e) => setTypeProduct_update(e.target.value)}
                  defaultValue={typeProduct_update}
                >
                  <option>ประเภทสินค้า</option>
                  {itemsType.map((val) => (
                    <option>{val.name_product}</option>
                  ))}
                </select>
              </div>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateTimelease}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default TestFirbase;
