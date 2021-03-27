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
import { Link, useHistory, useLocation } from "react-router-dom";

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

const SignUp = () => {
  const [loggedInUser, setLoggedInUser] = useContext(userContext);

  const history = useHistory();
  const location = useLocation();
  console.log({ location });
  const { from } = location.state || { from: { pathname: "/" } };
  const redirect = () => {
    auth.currentUser && history.replace(from);
  };

  const [signUpErr, setSignUpErr] = useState({
    isSignUpError: false,
    errCode: "",
    errMsg: "",
  });

  const { handleSubmit, register, errors, getValues, setError } = useForm();

  const onSubmit = (values) => {
    setSignUpErr({
      isSignUpError: false,
      errCode: "",
      errMsg: "",
    });

    auth
      .createUserWithEmailAndPassword(values.email, values.confirm_password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoggedInUser({
          isLoggedIn: true,
          userCredential: user,
        });
        console.log(loggedInUser);
        redirect();
      })
      .catch((err) => {
        const errCode = err.code;
        const errMsg = err.message;
        setSignUpErr({ isSignUpError: true, errCode, errMsg });
        console.log(err);
      });
  };

  const isPasswordMatch = () => {
    const pass = getValues("password");
    const confirm_pass = getValues("confirm_password");
    console.log(confirm_pass);
    console.log(pass === confirm_pass && confirm_pass === pass);
    if (pass !== confirm_pass && confirm_pass !== pass) {
      setError("confirm_password", {
        type: "password_not_matched",
        message: "Password not matched",
      });
    }
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
        redirect();
      })
      .catch((err) => {
        const errCode = err.code;
        const errMsg = err.message;
        setSignUpErr({ isSignUpError: true, errCode, errMsg });
        console.log(err);
      });
  };

  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="55vh"
    >
      <Card className={classes.root} variant="outlined">
        <CardHeader title="Sign Up" align="center" />
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
            {signUpErr.isSignUpError && (
              <p align="center">
                {signUpErr.errCode === "auth/email-already-in-use"
                  ? signUpErr.errMsg
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
                  onChange={isPasswordMatch}
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

            <FormGroup>
              <FormControl>
                <InputLabel htmlFor="confirm_password">
                  Confirm Password
                </InputLabel>
                <Input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  aria-describedby="confirm_password"
                  onChange={isPasswordMatch}
                  inputRef={register({
                    required: "Required",
                  })}
                />
                {errors.confirm_password && (
                  <FormHelperText
                    id="confirm_password"
                    style={{ color: "red" }}
                  >
                    {errors.confirm_password.type === "required"
                      ? errors.confirm_password.message
                      : errors.confirm_password.type === "password_not_matched"
                      ? errors.confirm_password.message
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
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Box>
  );
};

export default SignUp;
