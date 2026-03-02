import type { ReactNode } from "react";
import "./LoginWrapper.css";
import Background from "../../../components/Background/Background";

interface LoginWrapperParams {
  children: ReactNode;
}

function LoginWrapper({ children }: LoginWrapperParams) {
  return (
    <>
      <Background />
      <div className="login-wrapper">{children}</div>
    </>
  );
}

export default LoginWrapper;
