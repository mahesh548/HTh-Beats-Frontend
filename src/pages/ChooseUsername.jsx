import { useLocation, useNavigate } from "react-router";
import LogoBack from "./components/LogoBack";
import LoginInput from "./components/LoginInput";
import { useState } from "react";
import LoginButton from "./components/LoginButton";
import utils from "../../utils";
export default function ChooseUsername() {
  const navigate = useNavigate();
  const location = useLocation();
  const credential = location?.state?.token || "";
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });
  const [loader, setLoader] = useState(false);
  const GoogleSignup = async () => {
    const verify = utils.verifyValue(username.input, "u");
    if (verify == "pass") {
      setLoader(true);
      const jsonData = { username: username.input, token: credential };
      const response = await utils.BACKEND("/google-signup", "POST", jsonData);
      setLoader(false);
      if (response.status == true) {
        navigate("/");
      } else if (response.status == false && response.field == "username") {
        setUsername({
          ...username,
          message: response.msg,
        });
      }
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
        <div className="inputWrapperLogin">
          <LoginInput
            placeholder="Choose a Username"
            formData={username}
            setFormData={setUsername}
          />
        </div>
        <LoginButton
          text="Continue"
          disabled={username.disable}
          func={() => {
            GoogleSignup();
          }}
          loader={loader}
        />
      </div>
    </>
  );
}
