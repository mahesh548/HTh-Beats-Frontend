import { useContext } from "react";
import { AuthContext } from "./components/Auth";
export default function Home() {
  const auth = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome {auth?.user?.username}</h1>
    </div>
  );
}
