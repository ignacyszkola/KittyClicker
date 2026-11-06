import "./LeftMenu.css";
import accountIcon from "../assets/account.svg";
import catIcon from "../assets/cat.svg";
import inventoryIcon from "../assets/inventory.svg";
import trophyIcon from "../assets/trophy.svg";

function LeftMenu() {
  return (
    <div className="leftMenu">
      <button className="achievmentsButton">
        <img src={trophyIcon} />
        Osiągnięcia
      </button>
      <button className="itemsButton">
        <img src={inventoryIcon} />
        Itemy
      </button>
      <button className="catsButton">
        <img src={catIcon} />
        Kot
      </button>
      <button className="accountButton">
        <img src={accountIcon} />
        Konto
      </button>
    </div>
  );
}

export default LeftMenu;
