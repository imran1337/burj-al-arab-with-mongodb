import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import header from "../../images/header.png";
import logo from "../../images/icons/logo.png";
import { auth } from "./../../firebase";

const Header = () => {
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        sessionStorage.removeItem('token');
        alert("log out success")
      })
      .catch((err) => console.log(err));
    console.log(auth.currentUser);
  };
  return (
    <div
      style={{
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${header})`,
      }}
      className="header"
    >
      <nav className="nav">
        <ul>
          <li>
            <img className="logo" src={logo} alt="" />
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>

          <li>
            <Link className="btn-book" to="/book/Single">
              Book
            </Link>
          </li>

          {auth.currentUser ? (
            <>
            <li>
              <Link to="/bookings">Manage</Link>
            </li>
            <li id="signOutTextColor" onClick={signOut}>
              Sign Out
            </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="title-container">
        <h1>Burj Al Arab</h1>
        <h2>A global icon of Arabian luxury</h2>
      </div>
    </div>
  );
};

export default Header;
