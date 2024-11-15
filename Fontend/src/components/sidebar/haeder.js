import React from "react";
import { useSelector } from "react-redux";
import { Navbar, Container } from "reactstrap";

const Haeder = () => {
  const nameType = useSelector((state) => state.auth.typename);
  return (
    <div
      style={{
        backgroundColor: "#774360",
        height: 80,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 80,
          alignItems: "center",
        }}
      >
        <h6
          style={{
            color: "#fff",
            marginLeft: 30,
            fontWeight: "bold",
            fontSize: 30,
          }}
        >
          {nameType}
        </h6>
      </div>
    </div>
  );
};

export default Haeder;
