import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";
import "./Chacts.css";
const Chacts = ({ Chacts5, Chacts2, lockSum, lockHire, lockFree }) => {
  let UserDatas = [
    {
      id: 1,
      name: "สมาชิกผู้ชื้อ",
      userGain: Chacts5,
    },
    {
      id: 2,
      name: "สมาชิกผู้ขาย",
      userGain: Chacts2,
    },
  ];

  const [userData, setUserData] = useState({
    labels: UserDatas.map((data) => data.name),

    datasets: [
      {
        label: "จำนวน",
        data: UserDatas.map((data) => data.userGain),
        backgroundColor: ["#B25068", "#E7AB79"],
        borderWidth: 2,
      },
    ],
  });

  let lockChact = [
    {
      id: 1,
      name: "ล็อคทั้งหมด",
      userGain: lockSum,
    },
    {
      id: 1,
      name: "ถูกเช่า",
      userGain: lockHire,
    },
    {
      id: 1,
      name: "ว่าง",
      userGain: lockFree,
    },
  ];

  const [userData2, setUserData2] = useState({
    labels: lockChact.map((data) => data.name),

    datasets: [
      {
        label: "จำนวน",
        data: lockChact.map((data) => data.userGain),
        backgroundColor: ["#3BACB6", "#AEDBCE", "#839AA8"],
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {}, []);

  return (
    <div className="Box_Chact">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h4>กราฟสมาชิกผู้ชื้อ-ผู้ขาย </h4>
        <h4 style={{ marginLeft: "44%" }}>กราฟ ล็อคขายทั้งหมด </h4>
      </div>
      <div className="itemChact">
        <div className="itemBar">
          <Bar data={userData} />
        </div>
        <div className="itemPie">
          <Pie data={userData2} />
        </div>
      </div>
    </div>
  );
};

export default Chacts;
