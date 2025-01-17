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
      setUser(userData.msg);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ checkSession, authentication, user }}>
      {children}
    </AuthContext.Provider>
  );
}
