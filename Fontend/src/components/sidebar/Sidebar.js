import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import "./sidebar.scss";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { useDispatch } from "react-redux";
import { setnameType } from "../layout/authSlice.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
const sidebarNavItems = [
  {
    display: "หน้าหลัก",
    icon: <i className="bx bx-home"></i>,
    to: "/",
    section: "",
  },
  {
    display: "จัดการสมาชิกผู้ชื้อ",
    icon: <i className="bx bx-user"></i>,
    to: "/starteds",
    section: "starteds",
  },
  {
    display: "จัดการสมาชิกผู้ขาย",
    icon: <i className="bx bx-user"></i>,
    to: "/started",
    section: "started",
  },
  {
    display: "จัดการล็อคขายสินค้า",
    icon: <i className="bx bx-receipt"></i>,
    to: "/calendar",
    section: "calendar",
  },
  {
    display: "จัดการประเถทสินค้า",
    icon: <i className="bx bx-receipt"></i>,
    to: "/user",
    section: "user",
  },
  {
    display: "จัดการสัญญาเช่า",
    icon: <i className="bx bx-receipt"></i>,
    to: "/Firbase",
    section: "Firbase",
  },

  {
    display: "เพิ่มสมาชิกแอดมิน",
    icon: <i className=""></i>,
    to: "/register",
    section: "register",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const nameType = useDispatch();
  const email = useSelector((state) => state.auth.user);
  const [activeIndex, setActiveIndex] = useState(0);
  const sidebarRef = useRef();
  const location = useLocation();

  const userID = localStorage.getItem("id");

  const [userShow, setShowuser] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    showuserid();
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    nameType(setnameType({ nameTypes: activeItem }));
  }, [location]);

  const Logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    window.location.reload();
  };

  const showuserid = async () => {
    axios
      .get(`http://localhost:3001/admin/${userID}`, {})
      .then(function (result) {
        setShowuser(result.data[0]);
      });
  };
  useEffect(() => {}, []);
  return (
    <div className="sidebar">
      <br />
      <div
        className="sidebar__logo"
        style={{ color: "#fff", width: "100%", alignItems: "center" }}
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ width: 100, height: 100 }} alt="Remy Sharp" />
        </StyledBadge>
        <div>
          <p style={{ color: "#fff", fontSize: 15 }}>{userShow.name_adm}</p>
        </div>
      </div>

      <br />
      <div ref={sidebarRef} className="sidebar__menu">
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index} style={{ textDecoration: "none" }}>
            <div
              className={`sidebar__menu__item ${
                activeIndex === index ? "active " : "active2"
              }`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 200,
                }}
              >
                <div className="sidebar__menu__item__icon">{item.icon}</div>
                <div className="sidebar__menu__item__text">{item.display}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <br />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          size="large"
          startIcon={<DeleteIcon />}
          variant="contained"
          style={{ width: "90%", backgroundColor: "#B25068" }}
          onClick={handleClickOpen}
        >
          ออกจากระบบ
        </Button>
      </div>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <div style={{ textAlign: "center" }}>
              <h5>คุณต้องการออกจากระบบหรือไม่</h5>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
          </DialogContent>
          <DialogActions>
            <div style={{ width: 300 }}>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={Logout}
                  style={{ marginRight: 20 }}
                >
                  ตกลง
                </Button>
                <Button onClick={handleClose} variant="contained" color="error">
                  ยกเลิก
                </Button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 2.2s infinite ease-in-out",
      border: "3px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.5)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(3.4)",
      opacity: 0,
    },
  },
}));
