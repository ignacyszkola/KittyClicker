import "./LeftMenu.css";
import accountIcon from "../assets/account.svg";
import catIcon from "../assets/cat.svg";
import inventoryIcon from "../assets/inventory.svg";
import trophyIcon from "../assets/trophy.svg";

function LeftMenu({ isOpen, achievmentsOpen, openAchievmentsMenu, itemsOpen, openItemsMenu, catsOpen, openCatsMenu, accountOpen, openAccountMenu }) {
  return (
    <div className={`leftMenu ${isOpen ? "open" : ""}`}>
      <button className={`achievmentsButton ${achievmentsOpen ? "active" : ""}`} onClick={openAchievmentsMenu}>
        <img src={trophyIcon} />
        Achievements
      </button>
      <button className={`itemsButton ${itemsOpen ? "active" : ""}`} onClick={openItemsMenu}>
        <img src={inventoryIcon} />
        Items
      </button>
      <button className={`catsButton ${catsOpen ? "active" : ""}`} onClick={openCatsMenu}>
        <img src={catIcon} />
        Cat
      </button>
      <button className={`accountButton ${accountOpen ? "active" : ""}`} onClick={openAccountMenu}>
        <img src={accountIcon} />
        Account
      </button>
    </div>
  );
}

export default LeftMenu;
