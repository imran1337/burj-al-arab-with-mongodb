import React, { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Book from "./components/Book/Book";
import Header from "./components/Header/Header";
import { auth } from "./firebase";
import { useEffect } from "react";
import SignUp from "./components/SignUp/SignUp";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { PrivateRouteForLoginAndSignUp } from "./components/PrivateRoute/PrivateRoute";
import Bookings from './components/Bookings/Bookings';

export const userContext = React.createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    isLoggedIn: false,
    userCredential: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser({
          isLoggedIn: true,
          userCredential: user,
        });
      } else {
        setLoggedInUser({
          isLoggedIn: false,
          userCredential: "",
        });
        console.log("auth user not found");
      }
    });
  }, [setLoggedInUser]);
  return (
    <userContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <Header />
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <PrivateRouteForLoginAndSignUp path="/login">
            <Login />
          </PrivateRouteForLoginAndSignUp>
          <PrivateRouteForLoginAndSignUp path="/signup">
            <SignUp />
          </PrivateRouteForLoginAndSignUp>
          <PrivateRoute path="/book/:bedType">
            <Book />
          </PrivateRoute>
          <PrivateRoute path="/bookings">
            <Bookings />
          </PrivateRoute>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </userContext.Provider>
  );
}

export default App;
