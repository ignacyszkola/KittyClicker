import "./Home.css";
import menuIcon from "../assets/menu.svg";
import cursorIcon from "../assets/cursor.png";
import catFoodIcon from "../assets/cat-food.png";
import closeIcon from "../assets/close.svg";
import { useState, useRef, useEffect } from "react";
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
import clickCat from "../assets/clickCat.webp";

function PlaySound(type) {
  const sounds = {
    click: clickSound,
  };
  const sound = new Audio(sounds[type]);
  sound.volume = 0.1;
  sound.play();
}

function ClickCat({ ownedCats }) {
  if (!ownedCats.clickCat) return null;
  return (
    <div className="clickCat">
      <img src={clickCat} />
    </div>
  );
}

function CatBtn({ onClick }) {
  return (
    <button
      className="catBtn"
      onClick={() => {
        onClick();
        PlaySound("click");
      }}
    >
      <img src={cat} draggable="false" />
    </button>
  );
}

function ClickPopups({ popups }) {
  return (
    <div className="popupLayer">
      {popups.map((p) => (
        <span
          key={p.id}
          className={`popup ${p.type}`}
          style={{ "--x": `${p.x}px`, "--y": `${p.y}px` }}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}

function OpenLftMenuBtn({ onClick, isOpen }) {
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
  const [money, setMoney] = useState(40000);
  const [leftMenu, setleftMenu] = useState(false);
  const [achievmentsMenu, setachievmentsMenu] = useState(false);
  const [itemsMenu, setitemsMenu] = useState(false);
  const [catsMenu, setcatsMenu] = useState(false);
  const [accountMenu, setaccountMenu] = useState(false);
  const [ownedCats, setOwnedCats] = useState({});
  const [ownedUpgrades, setOwnedUpgrades] = useState({});
  const [popups, setPopups] = useState([]);
  const popupId = useRef(0);

  const clickPower = 1 * UpgradeValue("multiCat", "clickMulti");
  const moneyDropChance = UpgradeValue("moneyDropChanceCat", "moneyDropChance", 0.25);
  const moneyMulti = 1 * UpgradeValue("moneyMultiCat", "moneyMulti");
  const critClickPower = UpgradeValue("critMultiCat", "critMulti", 2);
  const critChance = UpgradeValue("critChanceMultiCat", "critChanceMulti", 0.05);

  function addPopups(items) {
    const created = items.map((item) => ({
      ...item,
      id: popupId.current++,
      x: Math.round(Math.random() * 360 - 130),
      y: Math.round(Math.random() * 500 - 180),
    }));

    setPopups((list) => [...list, ...created]);

    setTimeout(() => {
      const ids = created.map((p) => p.id);
      setPopups((list) => list.filter((p) => !ids.includes(p.id)));
    }, 900);
  }

  function UpgradeValue(catId, key, base = 1) {
    const cat = cats.find((c) => c.id === catId);
    if (!ownedCats[catId]) return base;

    const level = ownedUpgrades[catId] || 0;
    if (level === 0) return cat[key] ?? base;

    const upgrade = upgrades.filter((u) => u.catId === catId)[level - 1];
    return upgrade[key] ?? base;
  }

  function BuyCat(cat) {
    if (ownedCats[cat.id] || money < cat.cost) return;
    setMoney((m) => m - cat.cost);
    setOwnedCats((o) => ({ ...o, [cat.id]: true }));
  }

  function BuyUpgrade(upgrade) {
    const level = ownedUpgrades[upgrade.catId] || 0;
    const next = upgrades.filter((u) => u.catId === upgrade.catId)[level];

    if (!next || next.id !== upgrade.id) return;
    if (!ownedCats[upgrade.catId]) return;
    if (money < upgrade.cost) return;

    setMoney((m) => m - upgrade.cost);
    setOwnedUpgrades((l) => ({ ...l, [upgrade.catId]: level + 1 }));
  }

  function Click() {
    let moneyGain = 0;
    let critGain = 0;

    for (let i = 0; i < Math.floor(clickPower); i++) {
      if (Math.random() < moneyDropChance) moneyGain += moneyMulti;
    }

    if (Math.random() < critChance) critGain += clickPower * critClickPower;

    if (critGain > 0) {
      for (let i = 0; i < Math.floor(critGain); i++) {
        if (Math.random() < moneyDropChance) moneyGain += moneyMulti;
      }
    }

    setClicks((c) => c + clickPower + critGain);
    if (moneyGain > 0) setMoney((m) => m + moneyGain);

    const items = [{ type: "click", text: `+${clickPower}` }];
    if (moneyGain > 0) items.push({ type: "money", text: `+${moneyGain}` });
    if (critGain > 0) items.push({ type: "crit", text: `CRIT +${critGain}` });
    addPopups(items);
  }

  function GetClickCatStat(key) {
    const level = ownedUpgrades.clickCat || 0;
    const upgradesList = upgrades.filter((u) => u.catId === "clickCat");

    return (
      upgradesList[level - 1]?.[key] ?? cats.find((c) => c.id === "clickCat")?.[key] ?? 0
    );
  }

  useEffect(() => {
    if (!ownedCats.clickCat) return;

    const clickPower = GetClickCatStat("clickPower");
    const clickSpeed = GetClickCatStat("clickSpeed");
    const moneyDropChance = GetClickCatStat("moneyDropChance");
    const moneyDropAmount = GetClickCatStat("moneyMulti");
    const critChance = GetClickCatStat("critChance");
    const critClickPower = GetClickCatStat("critClickPower");

    const id = setInterval(() => {
      let moneyGain = 0;
      let critGain = 0;
      for (let i = 0; i < Math.floor(clickPower); i++) {
        if (Math.random() < moneyDropChance) moneyGain += moneyDropAmount;
      }
      
      if (Math.random() < critChance) critGain += clickPower * critClickPower;

      if (critGain > 0) {
        for (let i = 0; i < Math.floor(critGain); i++) {
          if (Math.random() < moneyDropChance) moneyGain += moneyDropAmount;
        }
      }

      setClicks((c) => c + clickPower + critGain);
      if (moneyGain > 0) setMoney((m) => m + moneyGain);

      const items = [{ type: "click", text: `+${clickPower}` }];
      if (moneyGain > 0) items.push({ type: "money", text: `+${moneyGain}` });
      if (critGain > 0) items.push({ type: "crit", text: `CRIT +${critGain}` });
      addPopups(items);
    }, 1000 / clickSpeed);

    return () => clearInterval(id);
  }, [ownedCats.clickCat, ownedUpgrades.clickCat]);

  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLftMenuBtn
        isOpen={leftMenu}
        onClick={() => setleftMenu((open) => !open)}
      />
      <Shop
        money={money}
        ownedCats={ownedCats}
        ownedUpgrades={ownedUpgrades}
        buyCat={BuyCat}
        buyUpgrade={BuyUpgrade}
      />
      <CatBtn onClick={Click} />
      <ClickPopups popups={popups} />
      <ClickCat ownedCats={ownedCats} />
      <ClickCounter clicksNumber={clicks} />
      <MoneyCounter moneyNumber={money} />
      <LeftMenu
        isOpen={leftMenu}
        openAchievmentsMenu={() => {
          setachievmentsMenu((open) => !open);
          setitemsMenu(false);
          setcatsMenu(false);
          setaccountMenu(false);
        }}
        achievmentsOpen={achievmentsMenu}
        openItemsMenu={() => {
          setitemsMenu((open) => !open);
          setachievmentsMenu(false);
          setcatsMenu(false);
          setaccountMenu(false);
        }}
        itemsOpen={itemsMenu}
        openCatsMenu={() => {
          setcatsMenu((open) => !open);
          setachievmentsMenu(false);
          setitemsMenu(false);
          setaccountMenu(false);
        }}
        catsOpen={catsMenu}
        openAccountMenu={() => {
          setaccountMenu((open) => !open);
          setachievmentsMenu(false);
          setitemsMenu(false);
          setcatsMenu(false);
        }}
        accountOpen={accountMenu}
      />
      <AchievmentsMenu
        isOpen={achievmentsMenu}
        close={() => setachievmentsMenu(false)}
      />
      <ItemsMenu isOpen={itemsMenu} close={() => setitemsMenu(false)} />
      <CatsMenu isOpen={catsMenu} close={() => setcatsMenu(false)} />
      <AccountMenu isOpen={accountMenu} close={() => setaccountMenu(false)} />
    </>
  );
}

export default Home;
