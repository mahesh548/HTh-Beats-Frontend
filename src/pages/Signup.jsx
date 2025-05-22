import LoginButton from "./components/LoginButton";
import LoginInput from "./components/LoginInput";
import LogoBack from "./components/LogoBack";
import { useState } from "react";
import utils from "../../utils";
import { useNavigate } from "react-router";
import LoginFooter from "./components/LoginFooter";
import ContinueGoogle from "./components/ContinueGoogle";

export default function signup() {
  const navigate = useNavigate();
  const [emailAdress, setEmailAdress] = useState({
    input: "",
    message: "",
    disable: true,
  });
  const [username, setUsername] = useState({
    input: "",
    message: "",
    disable: true,
  });
  const [loader, setLoader] = useState(false);
  const signup = async () => {
    const verifyEmail = utils.verifyValue(emailAdress.input, "e");
    const verifyUsername = utils.verifyValue(username.input, "u");
    if (verifyEmail == "pass" && verifyUsername == "pass") {
      setLoader(true);
      const jsonData = { email: emailAdress.input, username: username.input };
      const response = await utils.BACKEND("/signup", "POST", jsonData);
      setLoader(false);
      if (response.status == true) {
        navigate("/verify", {
          state: { id: response.id, mailHint: response.mailHint },
        });
      } else if (response.status == false && response.field == "email") {
        setEmailAdress({
          ...emailAdress,
          message: response.msg,
        });
      } else if (response.status == false && response.field == "username") {
        setUsername({
          ...username,
          message: response.msg,
        });
      }
    } else if (verifyEmail != "pass") {
      setEmailAdress({
        ...emailAdress,
        message: verifyEmail,
      });
    } else if (verifyUsername != "pass") {
      setUsername({
        ...username,
        message: verifyUsername,
      });
    }
  };
  return (
    <>
      <div className="page initialPage hiddenScrollbar deskScroll">
        <div className="pcWrap">
          <div className="loginContainer">
            <LogoBack />
            <p
              className="labelText desk fs-1 mt-1 text-center"
              style={{ maxWidth: "300px" }}
            >
              Sign up to start listening
            </p>
            <div className="inputWrapperLogin">
              <LoginInput
                placeholder="Enter Email Adress"
                formData={emailAdress}
                setFormData={setEmailAdress}
              />
              <LoginInput
                placeholder="Choose User Name"
                formData={username}
                setFormData={setUsername}
              />
            </div>
            <LoginButton
              text={"Continue"}
              disabled={username.disable || emailAdress.disable}
              func={() => {
                signup();
              }}
              loader={loader}
            />
            <div className="partitionLine">
              <hr />
              <p>OR</p>
              <hr />
            </div>
            <ContinueGoogle />
            <LoginFooter text="already have an account? Login" url="/login" />
          </div>
        </div>
      </div>
    </>
  );
}
