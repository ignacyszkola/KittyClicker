import "./LeftMenu.css";
import accountIcon from "../assets/account.svg";
import catIcon from "../assets/cat.svg";
import inventoryIcon from "../assets/inventory.svg";
import trophyIcon from "../assets/trophy.svg";

function LeftMenu({ isOpen, achievmentsOpen, openAchievmentsMenu, itemsOpen, openItemsMenu, catsOpen, openCatsMenu }) {
  return (
    <div className={`leftMenu ${isOpen ? "open" : ""}`}>
      <button className={`achievmentsButton ${achievmentsOpen ? "active" : ""}`} onClick={openAchievmentsMenu}>
        <img src={trophyIcon} />
        Osiągnięcia
      </button>
      <button className={`itemsButton ${itemsOpen ? "active" : ""}`} onClick={openItemsMenu}>
        <img src={inventoryIcon} />
        Itemy
      </button>
      <button className={`catsButton ${itemsOpen ? "active" : ""}`} onClick={openCatsMenu}>
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
