import LoginButton from "./components/LoginButton";
import LoginInput from "./components/LoginInput";
import { useState } from "react";
import LogoBack from "./components/LogoBack";
import utils from "../../utils";
import { useLocation, useNavigate } from "react-router";
export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState({
    input: "",
    message: "",
    disable: true,
  });
  const [loader, setLoader] = useState(false);
  const userMailHint = location?.state?.mailHint || "";

  const verifyOtp = async () => {
    const id = location?.state?.id || "";
    const verify = utils.verifyValue(otp.input, "otp");
    if (verify == "pass") {
      setLoader(true);
      const jsonData = { otp: otp.input, id: id };
      const response = await utils.BACKEND("/verify", "POST", jsonData);
      setLoader(false);
      if (response.status == true) {
        navigate("/");
      }
      if (response.status == false) {
        setOtp({
          ...otp,
          message: response.msg,
        });
      }
    } else {
      setOtp({
        ...otp,
        message: verify,
      });
    }
  };
  return (
    <div className="loginContainer">
      <LogoBack />
      <div className="otpTitle">
        <b>Verify Your Email</b>
        <p>
          Enter 4 digits OTP that we sent to <span>{userMailHint}</span>
        </p>
      </div>
      <div className="inputWrapperLogin">
        <LoginInput
          placeholder="Enter 4 digit OTP"
          formData={otp}
          setFormData={setOtp}
        />
      </div>
      <LoginButton
        text="Verify"
        disabled={otp.disable}
        func={() => {
          verifyOtp();
        }}
        loader={loader}
      />
    </div>
  );
}
