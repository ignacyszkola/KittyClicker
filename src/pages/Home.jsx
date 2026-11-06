import "./Home.css";
import menuIcon from "../assets/menu.svg";
import cursorIcon from "../assets/cursor.png";
import catFoodIcon from "../assets/cat-food.png";
import { useState } from "react";
import { FormatNumber } from "../utils/FormatNumber";

function OpenLeftMenuButton() {
  return (
    <button className="menuButton">
      <img src={menuIcon} />
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
  const [clicks, setClicks] = useState(1000000000000);
  const [money, setMoney] = useState(2137);
  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLeftMenuButton />
      <Shop money={money} />
      <ClickCounter clicksNumber={clicks} />
      <MoneyCounter moneyNumber={money} />
    </>
  );
}

export default Home;
