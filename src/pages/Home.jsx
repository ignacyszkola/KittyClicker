import "./Home.css";
import menuIcon from "../assets/menu.svg";
import cursorIcon from "../assets/cursor.png";
import catFoodIcon from "../assets/cat-food.png";
import closeIcon from "../assets/close.svg";
import { useState } from "react";
import { FormatNumber } from "../utils/FormatNumber";
import LeftMenu from "../components/LeftMenu";
import AchievmentsMenu from "../components/AchievmentsMenu";
import ItemsMenu from "../components/ItemsMenu";
import CatsMenu from "../components/CatsMenu";
import AccountMenu from "../components/AccountMenu";

function OpenLeftMenuButton({ onClick, isOpen }) {
  return (
    <button className="menuButton" onClick={onClick}>
      <img src={isOpen ? closeIcon : menuIcon} />
    </button>
  );
}

function Shop({ money }) {
  const [shopPage, setShopPage] = useState("cats");
  return (
    <div className="shop">
      <h2>Sklep</h2>
      <div className="shopHeaderButtons">
        <button id="shopCatButton" onClick={() => setShopPage("cats")}>
          Koty
        </button>
        <button id="shopUpgradeButton" onClick={() => setShopPage("upgrades")}>
          Ulepszenia
        </button>
      </div>
      <div className="shopContent"></div>
    </div>
  );
}

function ClickCounter({ clicksNumber }) {
  return (
    <div className="clickCounter">
      <img src={cursorIcon} />
      <p>{FormatNumber(clicksNumber)}</p>
    </div>
  );
}

function MoneyCounter({ moneyNumber }) {
  return (
    <div className="moneyCounter">
      <img src={catFoodIcon} />
      <p>{FormatNumber(moneyNumber)}</p>
    </div>
  );
}

function Home() {
  const [clicks, setClicks] = useState(111111100000000000);
  const [money, setMoney] = useState(2137);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [achievmentsMenuOpen, setAchievmentsMenuOpen] = useState(false);
  const [itemsMenuOpen, setItemsMenuOpen] = useState(false);
  const [catsMenuOpen, setCatsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLeftMenuButton
        isOpen={leftMenuOpen}
        onClick={() => setLeftMenuOpen((open) => !open)}
      />
      <Shop money={money} />
      <ClickCounter clicksNumber={clicks} />
      <MoneyCounter moneyNumber={money} />
      <LeftMenu
        isOpen={leftMenuOpen}
        openAchievmentsMenu={() => {
          setAchievmentsMenuOpen((open) => !open);
          setItemsMenuOpen(false);
          setCatsMenuOpen(false);
          setAccountMenuOpen(false);
        }}
        achievmentsOpen={achievmentsMenuOpen}
        openItemsMenu={() => {
          setItemsMenuOpen((open) => !open);
          setAchievmentsMenuOpen(false);
          setCatsMenuOpen(false);
          setAccountMenuOpen(false);
        }}
        itemsOpen={itemsMenuOpen}
        openCatsMenu={() => {
          setCatsMenuOpen((open) => !open);
          setAchievmentsMenuOpen(false);
          setItemsMenuOpen(false);
          setAccountMenuOpen(false);
        }}
        catsOpen={catsMenuOpen}
        openAccountMenu={() => {
          setAccountMenuOpen((open) => !open);
          setAchievmentsMenuOpen(false);
          setItemsMenuOpen(false);
          setCatsMenuOpen(false);
        }}
        accountOpen={accountMenuOpen}
      />
      <AchievmentsMenu
        isOpen={achievmentsMenuOpen}
        close={() => setAchievmentsMenuOpen(false)}
      />
      <ItemsMenu isOpen={itemsMenuOpen} close={() => setItemsMenuOpen(false)} />
      <CatsMenu isOpen={catsMenuOpen} close={() => setCatsMenuOpen(false)} />
      <AccountMenu
        isOpen={accountMenuOpen}
        close={() => setAccountMenuOpen(false)}
      />
    </>
  );
}

export default Home;
