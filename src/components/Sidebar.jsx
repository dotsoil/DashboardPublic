import React, { useContext, useEffect, useState } from "react";
import { GrassOutlined, HomeMiniRounded, LogoutOutlined } from "@mui/icons-material";
import { FiServer } from "react-icons/fi";
import { VscGraph, VscHome } from "react-icons/vsc";
import { RiAdminLine } from "react-icons/ri";
import { SiOpenstreetmap } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/dots-logo.png";
import globalContext from "../context/GlobalContext";
import { Container, Row, Col, Image } from "react-bootstrap";
import ToggleDarkMode from "./ToggleDarkMode";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function Sidebar({ hidden, isAdmin, logOut, toggleTheme, theme }) {
  const { t } = useTranslation();
  const { user } = useContext(globalContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveIndex(1);
    } else if (path.includes("/analyze")) {
      setActiveIndex(2);
    } else if (path.includes("/admins")) {
      setActiveIndex(3);
    } else if (path.includes("/Map")) {
      setActiveIndex(4);
    } else if (path.includes("/logout")) {
      setActiveIndex(5);
    } else if (path === "/profile") {
      // setActiveIndex(6);
    } 
    else if (path === "/fields") {
      setActiveIndex(7);
    }else {
      setActiveIndex(1);
    }
    // effect when react dom Link is clicked
  }, [location]);
  const handleClick = (index) => {
    setActiveIndex(index);
    index === 6
      ? (document.getElementById("profileImg").style.transform = "scale(1.3)")
      : (document.getElementById("profileImg").style.transform = "scale(1)");
  };

  useEffect(() => {}, [user]);

  return !hidden ? (
    <div className="sidebar">
      <div className="upper__container">
        <Col>
          <img
            src={Logo}  
            alt=""
          />
          <h6
            onClick={() => {
              toast.info(
                "This is a beta version of the app, please report any bugs to the developers",
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );
            }}
          >
            {t("Beta")}
          </h6>
          <div className="profile_img">
          <Link
            to={"/profile"}
            onClick={() => handleClick(6)}
            className={6 === activeIndex ? "active" : ""}
            key={6}
          >
            <Image
              src={user?.pictureUrl}
              style={styles.profileImg}
              id="profileImg"
            />
            <h6 >{user?.Fname}</h6>
          </Link>
          </div>
        </Col>
        <div className="brand">
          <ul className="links">
            <Link
              to="/"
              onClick={() => handleClick(1)}
              className={1 === activeIndex ? "active" : ""}
              key={1}
            >
              <li>
                <VscHome size={35} />
                <span>{t("Home")}</span>
              </li>
            </Link>
            <Link
              to="analyze"
              onClick={() => handleClick(2)}
              className={2 === activeIndex ? "active" : ""}
              key={2}
            >
              <li>
                <VscGraph size={30} />
                <span>{t("Analyze")}</span>
              </li>
            </Link>
            <Link
              to="fields"
              onClick={() => handleClick(7)}
              className={7 === activeIndex ? "active" : ""}
              key={7}
            >
              <li>
                <GrassOutlined size={30} />
                <span>{t("Fields")}</span>
              </li>
            </Link>

            {isAdmin && (
              <Link
                to="admins"
                onClick={() => handleClick(3)}
                className={3 === activeIndex ? "active" : ""}
                key={3}
              >
                <li>
                  <RiAdminLine size={30} />
                  <span>{t("Admins")}</span>
                </li>
              </Link>
            )}

            {!isAdmin && (
              <Link
                to="Map"
                onClick={() => handleClick(4)}
                className={4 === activeIndex ? "active" : ""}
                key={4}
              >
                <li>
                  <SiOpenstreetmap size={30} />
                  <span>{t("Sensors")}</span>
                </li>
              </Link>
            )}

            <Link
              to="logout"
              onClick={() => {
                handleClick(5);
                logOut();
              }}
            >
              <li className={5 === activeIndex ? "active" : ""} key={5}>
                <LogoutOutlined size={30} />
                <span>{t("Logout")}</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>

      <h5>
        Copyright &copy; 2021 Dots.<br></br> All rights reserved
        <sup>TM</sup>
      </h5>
    </div>
  ) : null;
}

const styles = {
  profileContainer: {
    display: "flex",
    justifyContent: "center",
  },
  profileImg: {
    borderRadius: "100%",
    cursor: "pointer",
    boxShadow: "0 0 0 2px #fff",
    maxWidth: "100px",
    maxHeight: "100px",
  },
  // userName: {
  //   fontSize: "1.2rem",
  //   fontWeight: "bold",
  //   color: "#fff",
  //   textAlign: "center",
  //   zIndex: "1",
  //   cursor: "pointer",
  // },
};

export default Sidebar;
