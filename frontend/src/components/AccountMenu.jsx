import "./AccountMenu.css";
import closeIcon from "../assets/close.svg";
import { useAuth } from "../useAuth.js";

function AccountMenu({ isOpen, close }) {
  const { user, logout } = useAuth();

  return (
    <div className={`accountMenu ${isOpen ? "open" : ""}`}>
      <h2 id="accountMenuHeader">Konto</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} alt="" />
      </button>
      <div className="accountDetails">
        <h2>Account Details</h2>
        <label htmlFor="nazwaUzytkownika">Username</label>
        <input
          id="nazwaUzytkownika"
          type="text"
          value={user?.username ?? ""}
          readOnly
        />
        <button className="logoutButton" onClick={logout}>
          Loggout
        </button>
      </div>
    </div>
  );
}

export default AccountMenu;
