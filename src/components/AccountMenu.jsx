import "./AccountMenu.css";
import { useState } from "react";
import closeIcon from "../assets/close.svg";
import offIcon from "../assets/off.svg";
import onIcon from "../assets/on.svg";
function AccountMenu({ isOpen, close }) {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <div className={`accountMenu ${isOpen ? "open" : ""}`}>
      <h2 id="accountMenuHeader">Konto</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} />
      </button>
      <div className="accountDetails">
        <h2>Dane konta</h2>
        <label htmlFor="nazwaUzytkownika">Nazwa użytkownika</label>
        <input id="nazwaUzytkownika" type="text" value={"Bober42067"} readOnly />
        <br />
        <label htmlFor="haslo">Hasło</label>
        <div className="passwordRow">
          <input id="haslo" type={`${showPassword ? "text" : "password"}`} value={"dsadasdsadsadsad"} readOnly />
          <button className="showButton" onClick={() => setShowPassword((show) => !show)}>
            <img src={showPassword ? onIcon : offIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountMenu;
