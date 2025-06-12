import React, { useContext } from "react";
import ConfirmPrompt from "./ConfirmPrompt";
import { AuthContext } from "./Auth";
import { HashContext } from "./Hash";
import { showToast } from "./showToast";
import utils from "../../../utils";

export default function RequestDownload() {
  const { user, authentication } = useContext(AuthContext);
  const { open } = useContext(HashContext);

  window.checkDownloadAccess = () => {
    if (user?.downloadAccess === "approved") return true;
    if (user?.downloadAccess === undefined) return false;
    if (user?.downloadAccess === "default") {
      open("requestDownload");
      return false;
    }
    if (user?.downloadAccess === "requested") {
      showToast({ text: "Your request is pending approval from the admin." });
      return false;
    }
  };

  const handleDownloadRequest = async () => {
    const response = await utils.BACKEND("/updateAccess", "POST", {
      accessData: {
        access: "requested",
      },
    });
    if (response.status == true) {
      await authentication();
      showToast({ text: "Your download request has been sent to the admin." });
    } else {
      showToast({
        text: "Failed to send download request. Please try again later.",
      });
    }
  };

  return (
    <ConfirmPrompt
      id="requestDownload"
      body="Not everyone can download files. You need to request permission from the admin."
      title="Request Download Permission"
      butText="Request"
      onConfirm={() => handleDownloadRequest()}
    />
  );
}
