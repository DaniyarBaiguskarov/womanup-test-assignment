import React from "react";
import { auth } from "../firebase-config.js";

const Auth = () => {
  const signin = () => {
    auth.signInAnonymously().catch(alert);
  };
  return <button onClick={signin}>Начать работу</button>;
};

export default Auth;
