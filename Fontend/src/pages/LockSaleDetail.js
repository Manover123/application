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
import MuiAlert from "@mui/material/Alert";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "react-data-table-component";
import { SearchIcon } from "./icon";
import customStyles from "./CustomStyles";
import ReportUser from "./DropDown/ReportUser";
export default function LockSaleDetail() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={1} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenedit] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [lockdata, setLockdata] = useState({
    id: "",
  });
  const [showTypeproduct, setshowTypeproduct] = useState([]);
  const [nameProduct, setnameProduct] = useState("");
  const [search, setSearch] = useState("");
  const [filteradCountries, setFilteradCountries] = useState([]);
  const loadTypeproduct = async () => {
    var response = fetch("http://localhost:3001/locksaleweb")
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setshowTypeproduct(myJson);
        setFilteradCountries(myJson);
      });
  };

  useEffect(() => {
    loadTypeproduct();
  }, []);
  useEffect(() => {
    const result = showTypeproduct.filter((country) => {
      return country.name_lock.toLowerCase().match(search.toLowerCase());
    });
    setFilteradCountries(result);
  }, [search]);

  const registerTypeproduct = () => {
    Axios.post("http://localhost:3001/createlocksale", {
      name_product: nameProduct,
    }).then((response) => {
      console.log(response);
      loadTypeproduct();
      handleClose();
    });
  };

  const deleteType = (id_lock) => {
    Axios.delete(`http://localhost:3001/deleterlocksale/${id_lock}`).then(
      (response) => {
        setshowTypeproduct(
          showTypeproduct.filter((res) => {
            return res.id_lock != id_lock;
          })
        );
      }
    );
  };

  const updateUserType = () => {
    Axios.put("http://localhost:3001/updatelocksale", {
      id_product: lockdata.id,
      nameProduct: lockdata.nameType,
    }).then(() => {
      console.log(lockdata);
      handleClickcloseEdit();
      loadTypeproduct();
    });
  };

  const loaddata = (id_product, name_product) => {
    setOpenedit(true);
    setLockdata({
      id: id_product,
      nameType: name_product,
    });
  };

  const setUser = (val, params) => {
    const lock = { ...lockdata };
    lock[params] = val.target.value;
    setLockdata(lock);
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
  const columns = [
    {
      name: "รหัสล็อค",
      selector: (row) => row.id_lock,
      sortable: true,
    },
    {
      name: "ชื่อล็อค",
      selector: (row) => row.name_lock,
      sortable: true,
    },
    {
      name: "สถานะเช่า",
      selector: (row) => row.onstatus,
      sortable: true,
    },
    {
      name: "สถานะเปิด-ปิด",
      selector: (row) => row.statusname,
    },
    {
      name: "แก้ไข",
      cell: (row) => (
        <div>
          <IconButton
            onClick={() => {
              loaddata(row.id_lock, row.name_lock);
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
                "คุณต้องการลบข้อมูลของ        " + row.name_lock
              );
              if (confirmBox === true) {
                deleteType(row.id_lock);
              }
            }}
          >
            <AlarmIcon />
          </IconButton> */}
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="content">
        <br />
        <div style={{ justifyContent: "center", display: "flex" }}></div>

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
            เพิ่มข้อมูลล็อกขายของ
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
              {"เพิ่มข้อมูลล็อกขายของ"}
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
                    label="ชื่อ-ล็อคขาย"
                    variant="standard"
                    onChange={(e) => setnameProduct(e.target.value)}
                  />
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={registerTypeproduct}
                variant="contained"
                endIcon={<Save />}
              >
                บันทึก
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
            <DialogTitle id="responsive-dialog-title">
              {"แก้ไขล็อคขาย"}
            </DialogTitle>
            {lockdata && (
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
                      defaultValue={lockdata.nameType}
                      onChange={(val) => setUser(val, "nameType")}
                    />
                  </Box>
                </DialogContentText>
              </DialogContent>
            )}
            <DialogActions>
              <Button
                onClick={() => updateUserType()}
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
