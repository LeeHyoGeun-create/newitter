import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../fBase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let user = null;
    try {
      if (newAccount) {
        // create account
        const userCredential = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        user = userCredential.user;
      } else {
        // login
        const userCredential = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        user = userCredential.user;
      }
    } catch (e) {
      console.log("errorCode ", e.code, "errorMessage ", e.message);
      setError(e.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  return (
    <>
      <form>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          id=""
          value={password}
          placeholder="Password"
          onChange={onChange}
          required
        />
        <input
          type="submit"
          onClick={onSubmit}
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
