import utils from "../../utils";
import LoginButton from "./components/LoginButton";
import LoginInput from "./components/LoginInput";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });

  const login = async () => {
    const verify = utils.verifyValue(username.input, "u&e");
    if (verify == "pass") {
      console.log("Login Successful");
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
        <div className="loginTitle">
          <img src="logo.png" alt="logo" />
          <p>Beats</p>
        </div>

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
      </div>
    </>
  );
}
