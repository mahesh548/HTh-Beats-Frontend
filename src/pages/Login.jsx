import utils from "../../utils";
import LoginButton from "./components/LoginButton";
import LoginInput from "./components/LoginInput";
import { useState } from "react";
import LogoBack from "./components/LogoBack";
import ContinueGoogle from "./components/ContinueGoogle";
import LoginFooter from "./components/LoginFooter";
import { useNavigate } from "react-router";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });
  const [loader, setLoader] = useState(false);
  const login = async () => {
    const verify = utils.verifyValue(username.input, "u&e");
    if (verify == "pass") {
      setLoader(true);
      const jsonData = { searchId: username.input };
      const response = await utils.BACKEND("/login", "POST", jsonData);
      setLoader(false);
      if (response.status == true) {
        navigate("/verify", {
          state: { id: response.id, mailHint: response.mailHint },
        });
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
      <div className="page">
        <div className="loginContainer">
          <LogoBack />
          <div className="inputWrapperLogin">
            <LoginInput
              placeholder="Enter Your Username or Email"
              formData={username}
              setFormData={setUsername}
            />
          </div>
          <LoginButton
            text="Continue"
            disabled={username.disable}
            func={() => {
              login();
            }}
            loader={loader}
          />
          <div className="partitionLine">
            <hr />
            <p>OR</p>
            <hr />
          </div>
          <ContinueGoogle />
          <LoginFooter text="don't have an account? Sign Up" url="/signup" />
        </div>
      </div>
    </>
  );
}
