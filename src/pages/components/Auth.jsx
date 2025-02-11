import { createContext, useState } from "react";
import utils from "../../../utils";
export const AuthContext = createContext();
/* 
{
username:"username",
pic:"avtar.png",
id:"uuid",
languages:["hindi","English"]
}
*/

export default function Auth({ children }) {
  const [user, setUser] = useState(null);
  const checkSession = () => {
    const session = localStorage.getItem("session");
    if (session) {
      return true;
    }
    return false;
  };
  const authentication = async () => {
    const userData = await utils.BACKEND("/user_data", "POST");
    if (userData.status == true) {
      saveUserData({ ...userData.msg });
      setUser({ ...userData.msg, verified: true });
      return true;
    }
    return false;
  };
  const saveUserData = (data) => {
    if (!localStorage.preferedPlaylist) {
      localStorage.setItem(
        "preferedPlaylist",
        JSON.stringify([
          { id: data.id, perma_url: data.id, title: "Liked Songs" },
        ])
      );
    }
  };

  return (
    <AuthContext.Provider value={{ checkSession, authentication, user }}>
      {children}
    </AuthContext.Provider>
  );
}
