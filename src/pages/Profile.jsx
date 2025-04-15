import { useContext } from "react";
import BackButton from "./components/BackButton";
import { AuthContext } from "./components/Auth";

export default function Profile() {
  const auth = useContext(AuthContext);
  return (
    <div className="page">
      <div className="profilePage">
        <div className="libraryNavCont">
          <div className="libraryNav">
            <BackButton />
            <p className="text-center text-white fw-light fs-4">
              Profile & settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
