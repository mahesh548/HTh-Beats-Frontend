import utils from "../../utils";
import LoginButton from "./components/LoginButton";
import LoginInput from "./components/LoginInput";
import { useState } from "react";
import LogoBack from "./components/LogoBack";
import ContinueGoogle from "./components/ContinueGoogle";
import LoginFooter from "./components/LoginFooter";

export default function Login() {
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });

  const login = async () => {
    const verify = utils.verifyValue(username.input, "u&e");
    if (verify == "pass") {
      const jsonData = { searchId: username.input };
      const response = await utils.BACKEND("/login", "POST", jsonData);
      if (response.status == true) {
        alert("enter otp");
      }
      if (response.status == false) {
        setUsername({
          ...username,
          message: response.msg,
        });
      }
      console.log(response);
    } else {
      setUsername({
        ...username,
        message: verify,
      });
    }
  };

  return (
    <>
      <div className="loginContainer">
        <LogoBack />
        <LoginInput
          placeholder="Enter Your Username or Email"
          formData={username}
          setFormData={setUsername}
        />
        <LoginButton
          text="Continue"
          formData={username}
          func={() => {
            login();
          }}
        />
        <div className="partitionLine">
          <hr />
          <p>OR</p>
          <hr />
        </div>
        <ContinueGoogle />
        <LoginFooter text="don't have an account? Sign Up" url="/signup" />
      </div>
    </>
  );
}
