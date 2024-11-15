import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Haeder from "../sidebar/haeder";

const AppLayout = ({ children }) => {
  return (
    <div
      style={{
        padding: "0px 0px 0px 295px",
        position: "relative",
      }}
    >
      <Sidebar />
      <Haeder />
      <div
        style={{
          padding: 20,
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
