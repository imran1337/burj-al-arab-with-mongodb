import React, { useContext, useState } from "react";
import { auth } from "./../../firebase";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  FormGroup,
  Button,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import { userContext } from "./../../App";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "./../SocialMediaLogin/SocialMedaiLoginManager";
import { Link, useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "100% !important",
    maxWidth: 500,
  },
  title: {
    fontSize: 14,
  },
  btnWidth: {
    minWidth: "100%",
    marginTop: 20,
  },
  marginTop: {
    paddingBottom: "35px !important",
  },
  logo: {
    color: red[500],
    margin: "0 5px",
    fontSize: 30,
    cursor: "pointer",
  },
});

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(userContext);

  const history = useHistory();
  const location = useLocation();
  console.log({ location });
  const { from } = location.state || { from: { pathname: "/" } };
  const redirect = () => {
    auth.currentUser && history.replace(from);
  };


  const [signInErr, setSignInErr] = useState({
    isSignInError: false,
    errCode: "",
    errMsg: "",
  });

  const { handleSubmit, register, errors } = useForm({
    mode: "onChange",
  });

  const onSubmit = (values) => {
    const { email, password } = values;
    console.log(values);
    setSignInErr({
      isSignInError: false,
      errCode: "",
      errMsg: "",
    });

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoggedInUser({
          isLoggedIn: true,
          userCredential: user,
        });
        console.log(loggedInUser);
        storeAuthToken()
        redirect();
      })
      .catch((err) => {
        const errCode = err.code;
        const errMsg = err.message;
        setSignInErr({ isSignInError: true, errCode, errMsg });
        console.log(err);
      });
  };

  const socialMediaLoginHandler = (providerName) => {
    auth
      .signInWithPopup(providerName)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoggedInUser({
          isLoggedIn: true,
          userCredential: user,
        });
        console.log(loggedInUser);
        storeAuthToken()
        redirect();
      })
      .catch((err) => {
        const errCode = err.code;
        const errMsg = err.message;
        setSignInErr({ isSignInError: true, errCode, errMsg });
        console.log(err);
      });
  };

  const classes = useStyles();

  const storeAuthToken = () => {
    if(sessionStorage.getItem('token')){
      sessionStorage.removeItem('token');
      console.log('token removed')
    }
    auth.currentUser
      .getIdToken(true)
      .then((idToken) => {
        sessionStorage.setItem('token',idToken);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="55vh"
    >
      <Card className={classes.root} variant="outlined">
        <CardHeader title="Sign In" align="center" />
        <Box display="flex" justifyContent="flex-end">
          <FacebookIcon
            onClick={() => socialMediaLoginHandler(FacebookAuthProvider)}
            className={classes.logo}
          />
          <GitHubIcon
            onClick={() => socialMediaLoginHandler(GithubAuthProvider)}
            className={classes.logo}
          />
          <p
            onClick={() => socialMediaLoginHandler(GoogleAuthProvider)}
            className={classes.logo}
          >
            G
          </p>
        </Box>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {signInErr.isSignInError && (
              <p align="center" style={{ color: "red" }}>
                {signInErr.errCode === "auth/email-already-in-use"
                  ? signInErr.errMsg
                  : signInErr.errCode === "auth/network-request-failed"
                  ? signInErr.errMsg
                  : ""}
              </p>
            )}
            <FormGroup>
              <FormControl>
                <InputLabel htmlFor="email">Email address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  aria-describedby="email"
                  inputRef={register({
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <FormHelperText id="email" style={{ color: "red" }}>
                    {errors.email.type === "required"
                      ? errors.email.message
                      : errors.email.type === "pattern"
                      ? errors.email.message
                      : ""}
                  </FormHelperText>
                )}
              </FormControl>
            </FormGroup>

            <FormGroup name="password">
              <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  aria-describedby="password"
                  inputRef={register({
                    required: "Required",
                    minLength: {
                      value: 6,
                      message: "Password length minimum 6",
                    },
                  })}
                />
                {errors.password && (
                  <FormHelperText id="password" style={{ color: "red" }}>
                    {errors.password.type === "required"
                      ? errors.password.message
                      : errors.password.type === "minLength"
                      ? errors.password.message
                      : ""}
                  </FormHelperText>
                )}
              </FormControl>
            </FormGroup>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              className={classes.btnWidth}
              type="submit"
              onClick={() => console.log(loggedInUser)}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
      <p>
        Already have not an account? <Link to="/signup">Sign Up</Link>
      </p>
    </Box>
  );
};

export default Login;
