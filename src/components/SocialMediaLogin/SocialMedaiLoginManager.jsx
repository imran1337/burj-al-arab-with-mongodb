import firebase from "firebase/app";
import "firebase/auth";

export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const FacebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const GithubAuthProvider = new firebase.auth.GithubAuthProvider();
