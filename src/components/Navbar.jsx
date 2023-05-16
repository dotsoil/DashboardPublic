import React, { useState, useEffect, useContext } from "react";
import avatar from "../assets/dots-logo.png";
import { Image } from "react-bootstrap";
import globalContext from "../context/GlobalContext";
import { Link } from "react-router-dom";
function Navbar({}) {
  const { user } = useContext(globalContext);
  const [userPic, setUserPic] = useState(avatar);
  const [userName, setUserName] = useState("Guest");
  useEffect(() => {
    console.log(user);
    if (user?.pictureUrl) {
      setUserPic(user?.pictureUrl);
    }
    if (user?.Fname) {
      setUserName(user?.Fname);
    }
  }, [user]);

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div className="info">
        <h5>{userName?.toUpperCase()}</h5>
        <div className="avatar">
          <Link to="/profile">
          <Image
            src={userPic}
            alt=""
            rounded="true"
            roundedCircle="true"
            style={{
              width: "50px",
              height: "50px",
            }}
          />
</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
