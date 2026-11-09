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
import cat from "../assets/cat.png";
import { cats, upgrades } from "../utils/ShopData";
import ShopItem from "../components/ShopItem";
import clickSound from "../assets/clickSound.mp3";

function PlaySound(type) {
  const sounds = {
    click: clickSound,
  };
  const sound = new Audio(sounds[type]);
  sound.volume = 0.15;
  sound.play();
}

function CatButton({ onClick }) {
  return (
    <button
      className="catButton"
      onClick={() => {
        onClick();
        PlaySound("click");
      }}
    >
      <img src={cat} draggable="false" />
    </button>
  );
}

function OpenLeftMenuButton({ onClick, isOpen }) {
  return (
    <button className="menuButton" onClick={onClick}>
      <img src={isOpen ? closeIcon : menuIcon} />
    </button>
  );
}

function Shop({ money, owned, buy }) {
  const [shopPage, setShopPage] = useState("cats");
  const list = shopPage === "cats" ? cats : upgrades;
  return (
    <div className="shop">
      <h2>Sklep</h2>
      <div className="shopHeaderButtons">
        <button className={shopPage === "cats" ? "active" : ""} onClick={() => setShopPage("cats")}>
          Koty
        </button>
        <button className={shopPage === "upgrades" ? "active" : ""} onClick={() => setShopPage("upgrades")}>
          Ulepszenia
        </button>
      </div>
      <div className="shopContent">
        {list.map((item) => {
          return (
            <ShopItem
              key={item.id}
              name={item.name}
              cost={item.cost}
              canAfford={money >= item.cost}
              buy={() => buy(item, item.cost)}
            />
          );
        })}
      </div>
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
  const [clicks, setClicks] = useState(0);
  const [money, setMoney] = useState(100);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [achievmentsMenuOpen, setAchievmentsMenuOpen] = useState(false);
  const [itemsMenuOpen, setItemsMenuOpen] = useState(false);
  const [catsMenuOpen, setCatsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const dropChance = 0.25;
  const clickPower = 1;

  const [owned, setOwned] = useState({});

  function BuyItem(item, cost) {
    if (money < cost) return;
    setMoney((m) => m - cost);
    setOwned((o) => ({ ...o, [item.id]: o[item.id] ? false : true }));
  }

  function handleClick() {
    setClicks((c) => c + clickPower);

    if (Math.random() < dropChance) {
      setMoney((m) => m + 1);
    }
  }

  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLeftMenuButton
        isOpen={leftMenuOpen}
        onClick={() => setLeftMenuOpen((open) => !open)}
      />
      <Shop money={money} owned={owned} buy={BuyItem} />
      <CatButton onClick={handleClick} />
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
