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

function Shop({ money, ownedCats, ownedUpgrades, buyCat, buyUpgrade }) {
  const [shopPage, setShopPage] = useState("cats");
  return (
    <div className="shop">
      <h2>Sklep</h2>
      <div className="shopHeaderButtons">
        <button
          className={shopPage === "cats" ? "active" : ""}
          onClick={() => setShopPage("cats")}
        >
          Koty
        </button>
        <button
          className={shopPage === "upgrades" ? "active" : ""}
          onClick={() => setShopPage("upgrades")}
        >
          Ulepszenia
        </button>
      </div>
      <div className="shopContent">
        {shopPage === "cats" &&
          cats
            .filter((cat) => !ownedCats[cat.id])
            .map((cat) => (
              <ShopItem
                key={cat.id}
                name={cat.name}
                cost={cat.cost}
                canAfford={money >= cat.cost}
                buy={() => buyCat(cat)}
              />
            ))}

        {shopPage === "upgrades" &&
          cats
            .filter((cat) => ownedCats[cat.id])
            .map((cat) => {
              const level = ownedUpgrades[cat.id] || 0;
              return upgrades.filter((u) => u.catId === cat.id)[level];
            })
            .filter(Boolean)
            .map((upgrade) => (
              <ShopItem
                key={upgrade.id}
                name={`${upgrade.catName} - ${upgrade.name}`}
                cost={upgrade.cost}
                canAfford={money >= upgrade.cost}
                buy={() => buyUpgrade(upgrade)}
              />
            ))}
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
  const [money, setMoney] = useState(1000);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [achievmentsMenuOpen, setAchievmentsMenuOpen] = useState(false);
  const [itemsMenuOpen, setItemsMenuOpen] = useState(false);
  const [catsMenuOpen, setCatsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const dropChance = 0.25;
  const clickPower = 1;

  const [ownedCats, setOwnedCats] = useState({});
  const [ownedUpgrades, setOwnedUpgrades] = useState({});

  function BuyCat(cat) {
    if (ownedCats[cat.id] || money < cat.cost) return;
    setMoney((m) => m - cat.cost);
    setOwnedCats((o) => ({ ...o, [cat.id]: true }));
  }

  function BuyUpgrade(upgrade) {
    const level = ownedUpgrades[upgrade.catId] || 0;
    const next = upgrades.filter((u) => u.catId === upgrade.catId)[level];
    if (!next || next.id !== upgrade.id) return;
    if (ownedUpgrades[upgrade.id] || money < upgrade.baseCost) return;
    if (!ownedCats[upgrade.catId]) return;
    setMoney((m) => m - upgrade.cost);
    setOwnedUpgrades((l) => ({ ...l, [upgrade.catId]: level + 1 }));
  }

  function handleClick() {
    setClicks((c) => c + clickPower);

    for (let i = 0; i < clickPower; i++) {
      if (Math.random() < dropChance) {
        setMoney((m) => m + 1);
      }
    }
  }

  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLeftMenuButton
        isOpen={leftMenuOpen}
        onClick={() => setLeftMenuOpen((open) => !open)}
      />
      <Shop
        money={money}
        ownedCats={ownedCats}
        ownedUpgrades={ownedUpgrades}
        buyCat={BuyCat}
        buyUpgrade={BuyUpgrade}
      />
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
