import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import jsPDF from "jspdf";
import ReactDOMServer from "react-dom/server";
import { Table } from "react-bootstrap";
import { fontList } from "./defaultVFS";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
// import fonts from "../../assets/font/supermarket.tff";

const ReportUser = (props) => {
  const { data } = props;
  const fileType = "";
  const fileExtension = ".xlsx";
  const fileName = "excel.";
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const datas = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(datas, fileName + fileExtension);
  };

  const exportPDF = () => {
    let element = (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Last name</th>
              <th scope="col">tel</th>
              <th scope="col">img</th>
              <th scope="col">username</th>
              <th scope="col">password</th>
              <th scope="col">edit</th>
              <th scope="col">status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => (
              <tr>
                <th scope="row">1</th>
                <td>{val.name_us}</td>
                <td>{val.email_us}</td>
                <td>{val.email_us}</td>
                <td>{val.email_us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    var doc = new jsPDF("p", "pt", "a4");
    doc.addFileToVFS("supermarket", fontList);
    doc.addFont("supermarket", "supermarket", "normal");
    doc.setFont("supermarket");
    doc.text(15, 15, "สวัดดี");
    // doc.text(15, 15, "สวัสดี ยินดีที่ได้รู้จักคุณ");
    doc.setLanguage("th");
    doc.html(ReactDOMServer.renderToString(element), {
      callback: function (doc) {
        doc.save("sample.pdf");
      },
      x: 10,
      y: 20,
    });
  };

  useEffect(() => {
    // console.log(data.map((val) => val.name_us));
  }, []);
  return (
    <div>
      <div className="dropdown">
        <button className="dropbtn">รายงาน</button>
        <div className="dropdown-content">
          <a href="#" onClick={() => exportToExcel(data)}>
            Excel
          </a>
          <a href="#" onClick={() => exportPDF()}>
            PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportUser;

// let element = (
//   <div style={{ width: "100%", height: "100%" }}>
//     <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th>First Name</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((val) => (
//           <tr>
//             <td>{val.name_us}</td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   </div>
// );
// const doc = new jsPDF("p", "pt", "a4");
// doc.addFileToVFS("supermarket.ttf", fontList);
// doc.addFont("supermarket.ttf", "supermarket", "normal");
// doc.setFont("supermarket");
// doc.html(ReactDOMServer.renderToString(element), {
//   callback: function (doc) {
//     doc.save("sample.pdf");
//   },
// });
