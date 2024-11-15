import React, { useEffect, useState, useCallback } from "react";
import AppLayout from "../components/layout/AppLayout";
import Chacts from "./Chact/Chacts";
import { useDispatch, useSelector } from "react-redux";
import { setChact, setChact2 } from "../components/layout/authSlice";
import "./Home.css";
import Axios from "axios";
import {
  GroupsIcon,
  StorefrontIcon,
  ProductionQuantityLimitsIcon,
  DataThresholdingIcon,
  FeedIcon,
  FastfoodIcon,
} from "./icon";

const Home = () => {
  const dispatch = useDispatch();
  const [loadSumUser, setLoadSumUser] = useState([]);

  const [loadSumMember, setloadSumMember] = useState([]);
  const [loadlocksale, setloadlocksale] = useState([]);

  const Chacts5 = useSelector((state) => state.auth.Chacts);
  const Chacts2 = useSelector((state) => state.auth.Chacts2);
  const [lockSum, setLockSum] = useState("");
  const [lockHire, setLockHire] = useState("");
  const [lockFree, setLockFree] = useState("");

  // let lockChact = {
  //   lockSum,
  //   lockHire,
  //   lockFree,
  // };

  // const LoadSumUser = async () => {
  //   await Axios.get("http://localhost:3001/LoadUserSum").then((res) => {
  //     setLoadSumUser(res.data);
  //     dispatch(setChact({ Chacts: res.data[0].UserTotol }));
  //   });
  //   await Axios.get("http://localhost:3001/LoadMembersaleSum").then((res) => {
  //     setloadSumMember(res.data);
  //     dispatch(setChact2({ Chacts2: res.data[0].MemberSum }));
  //   });
  //   await Axios.get("http://localhost:3001/LoadLocksaleStatus").then((res) => {
  //     setloadlocksale(res.data);
  //   });
  // };

  const fetchSumUser = useCallback(async () => {
    await Axios.get("http://localhost:3001/LoadUserSum").then((res) => {
      setLoadSumUser(res.data);
      dispatch(setChact({ Chacts: res.data[0].UserTotol.toString() }));
    });
    await Axios.get("http://localhost:3001/LoadMembersaleSum").then((res) => {
      setloadSumMember(res.data);
      dispatch(setChact2({ Chacts2: res.data[0].MemberSum.toString() }));
    });
    await Axios.get("http://localhost:3001/LoadLocksaleStatus").then((res) => {
      setloadlocksale(res.data);
      setLockSum(res.data[0].lockSum.toString());
      setLockHire(res.data[0].hire.toString());
      setLockFree(res.data[0].free.toString());
    });
  }, [dispatch]);

  useEffect(() => {
    fetchSumUser();
  }, [fetchSumUser]);

  return (
    <AppLayout>
      <div className="container">
        <div className="card">
          {loadSumUser.map((val) => (
            <div className="itemcard">
              <div className="fontTitel">
                <GroupsIcon fontSize="large" sx={{ fontSize: 50 }} />
                <p>จำนวนสมาชิกผู้ชื้อ {val.UserTotol}</p>
              </div>
              <div className="text">
                <p>{" มีสมาชิกผู้ชื้อทั้งหมด " + val.UserTotol}</p>
                <p>{" ใช้งานได้ปกติ     " + val.open}</p>
                <p>{" ถูกแบน     " + val.Ban}</p>
              </div>
            </div>
          ))}

          {loadSumMember.map((val) => (
            <div className="itemcard">
              <div className="fontTitel">
                <GroupsIcon fontSize="large" sx={{ fontSize: 50 }} />
                <p>จำนวนสมาชิกผู้ขาย {val.MemberSum}</p>
              </div>
              <div className="text">
                <p>{" มีสมาชิกผู้ขายทั้งหมด " + val.MemberSum}</p>
                <p>{" ใช้งานได้ปกติ     " + val.MemberOpen}</p>
                <p>{" ถูกแบน     " + val.MemberBan}</p>
              </div>
            </div>
          ))}
          {loadlocksale.map((val) => (
            <div className="itemcard">
              <div className="fontTitel">
                <StorefrontIcon fontSize="large" sx={{ fontSize: 50 }} />
                <p>จำนวนล็อคทั้งหมด {val.lockSum}</p>
              </div>
              <div className="text">
                <p>{" มีล็อกทั้งหมด " + val.lockSum}</p>
                <p>{" ถูกเช่า     " + val.hire}</p>
                <p>{" ว่าง    " + val.free}</p>
              </div>
            </div>
          ))}
          <div className="itemcard">
            <div className="fontTitel">
              <FastfoodIcon fontSize="large" sx={{ fontSize: 50 }} />
              <p>ประเภทสินค้า</p>
            </div>
            <div className="text"></div>
          </div>
          <div className="itemcard">
            <div className="fontTitel">
              <FeedIcon fontSize="large" sx={{ fontSize: 50 }} />
              <p>สัญญาเช่าล็อค</p>
            </div>
            <div className="text"></div>
          </div>
        </div>

        {Chacts5 && Chacts2 && lockSum && lockHire && lockFree && (
          <Chacts
            Chacts5={Chacts5}
            Chacts2={Chacts2}
            lockSum={lockSum}
            lockHire={lockHire}
            lockFree={lockFree}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Home;
