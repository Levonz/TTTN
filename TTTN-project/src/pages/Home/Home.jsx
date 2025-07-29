import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

var tables = [
  { label: "Bàn 1", status: "empty", capacity: 4 },
  { label: "Bàn 2", status: "reserved", capacity: 6 },
  { label: "Bàn 3", status: "empty", capacity: 6 },
  { label: "Bàn 4", status: "reserved", capacity: 4 },
];

const Home = () => {
  const [sectionActiveStatus, setSectionActiveStatus] = useState("empty");

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-header-first-line">
          <div className="home-header-navbar">
            <a href="" className="home-header-navbar-home-btn">
              HOME
            </a>
          </div>

          <div className="user-info">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </div>
        <div className="home-header-second-line">
          <a
            href="#"
            className={`table-status-section ${
              sectionActiveStatus === "empty"
                ? "table-status-section--active"
                : ""
            }`}
            onClick={() => {
              setSectionActiveStatus("empty");
            }}
          >
            Bàn trống
          </a>
          <a
            href="#"
            className={`table-status-section ${
              sectionActiveStatus === "reserved"
                ? "table-status-section--active"
                : ""
            }`}
            onClick={() => {
              setSectionActiveStatus("reserved");
            }}
          >
            Bàn đã đặt
          </a>
        </div>
        <div className="home-header-third-line">
          <a href="#" className="table-section table-section--active">
            Bàn 4 người
          </a>
          <a href="#6pTable" className="table-section">
            Bàn 6 người
          </a>
        </div>
      </div>
      <div className="home-page-content">
        <div className="section" id="4pTable">
          <p className="section-header">Bàn 4 người</p>
          <div className="section-content">
            {tables
              .filter(
                (table) =>
                  table.capacity === 4 && table.status === sectionActiveStatus,
              )
              .map((table) => (
                <div className="section-table-item">{table.label}</div>
              ))}
          </div>
        </div>
        <div className="section" id="6pTable">
          <p className="section-header">Bàn 6 người</p>
          <div className="section-content">
            {tables
              .filter(
                (table) =>
                  table.capacity === 6 && table.status === sectionActiveStatus,
              )
              .map((table) => (
                <div className="section-table-item">{table.label}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
