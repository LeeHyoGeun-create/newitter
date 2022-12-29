import React from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { authService } from "../fBase";
import AuthForm from "../components/AuthForm";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;

    if (name === "google") {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      }
    }
    if (name === "github") {
      try {
        const provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
      }
    }
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Contitue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Contitue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
