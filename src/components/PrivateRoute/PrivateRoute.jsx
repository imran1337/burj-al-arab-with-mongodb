import React from "react";
import { Redirect, Route } from "react-router-dom";
import { auth } from "./../../firebase";

const PrivateRoute = (props) => {
  const { children, ...rest } = props;
  console.log(props);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        console.log(location);
        return auth.currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export const PrivateRouteForLoginAndSignUp = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (auth.currentUser && <Redirect to="/" />) || children}
    />
  );
};

export default PrivateRoute;

/***
 *  <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
 */
