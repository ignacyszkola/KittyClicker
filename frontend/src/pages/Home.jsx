/* eslint-disable no-unused-vars */
import "./Home.css";
import menuIcon from "../assets/menu.svg";
import cursorIcon from "../assets/cursor.png";
import catFoodIcon from "../assets/cat-food.png";
import closeIcon from "../assets/close.svg";
import { useState, useRef } from "react";
import { FormatNumber } from "../utils/FormatNumber";
import LeftMenu from "../components/LeftMenu";
import AchievmentsMenu from "../components/AchievmentsMenu";
import ItemsMenu from "../components/ItemsMenu";
import CatsMenu from "../components/CatsMenu";
import AccountMenu from "../components/AccountMenu";
import cat from "../assets/cat.png";
import { cats, upgrades, items, clickCats } from "../utils/ShopData";
import ShopItem from "../components/ShopItem";
import clickSound from "../assets/clickSound.mp3";
import clickCat from "../assets/clickCat.webp";
import multiCat from "../assets/multiCat.gif";
import moneyMultiCat from "../assets/moneyMultiCat.gif";
import critMultiCat from "../assets/critMultiCat.webp";
import critChanceMultiCat from "../assets/critChanceMultiCat.webp";
import moneyDropChanceCat from "../assets/moneyDropChanceCat.webp";
import { useGameSync } from "../useGameSync";
import { useClickSender } from "../useClickSender";
import { useGoldenCat } from "../useGoldenCat";
import GoldenCat from "../components/GoldenCat";
import { useAuth } from "../useAuth";
import {
  buyCat as buyCatRequest,
  upgradeCat as upgradeCatRequest,
  useItem as activateItemRequest,
  selectSkin,
} from "../api/game";

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
      <img src={clickCat} draggable="false" />
    </div>
  );
}

function MultiCat({ ownedCats }) {
  if (!ownedCats.multiCat) return null;
  return (
    <div className="multiCat">
      <img src={multiCat} draggable="false" />
    </div>
  );
}

function MoneyMultiCat({ ownedCats }) {
  if (!ownedCats.moneyMultiCat) return null;
  return (
    <div className="moneyMultiCat">
      <img src={moneyMultiCat} draggable="false" />
    </div>
  );
}

function CritMultiCat({ ownedCats }) {
  if (!ownedCats.critMultiCat) return null;
  return (
    <div className="critMultiCat">
      <img src={critMultiCat} draggable="false" />
    </div>
  );
}

function CritChanceMultiCat({ ownedCats }) {
  if (!ownedCats.critChanceMultiCat) return null;
  return (
    <div className="critChanceMultiCat">
      <img src={critChanceMultiCat} draggable="false" />
    </div>
  );
}

function MoneyDropChanceCat({ ownedCats }) {
  if (!ownedCats.moneyDropChanceCat) return null;
  return (
    <div className="moneyDropChanceCat">
      <img src={moneyDropChanceCat} draggable="false" />
    </div>
  );
}

function CatBtn({ onClick, image }) {
  return (
    <button
      className="catBtn"
      onClick={() => {
        onClick();
        PlaySound("click");
      }}
    >
      <img src={image} draggable="false" />
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
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
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
      <img src={isOpen ? closeIcon : menuIcon} draggable="false" />
    </button>
  );
}

function Shop({ money, ownedCats, ownedUpgrades, buyCat, buyUpgrade }) {
  const [shopPage, setShopPage] = useState("cats");
  return (
    <div className="shop">
      <h2>Shop</h2>
      <div className="shopHeaderButtons">
        <button
          className={shopPage === "cats" ? "active" : ""}
          onClick={() => setShopPage("cats")}
        >
          Cats
        </button>
        <button
          className={shopPage === "upgrades" ? "active" : ""}
          onClick={() => setShopPage("upgrades")}
        >
          Upgrades
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
              const upgrade = upgrades.filter((u) => u.catId === cat.id)[level];
              return {
                ...(upgrade || {
                  id: `${cat.id}-${level + 1}`,
                  catId: cat.id,
                  catName: cat.name,
                  name: `Level ${level + 1}`,
                }),
                cost: Math.ceil(1 + (level + 1) * 1.5),
              };
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
      <img src={cursorIcon} draggable="false" />
      <p>{FormatNumber(clicksNumber)}</p>
    </div>
  );
}

function MoneyCounter({ moneyNumber }) {
  return (
    <div className="moneyCounter">
      <img src={catFoodIcon} draggable="false" />
      <p>{FormatNumber(moneyNumber)}</p>
    </div>
  );
}

function Home() {
  const { token, user } = useAuth();
  const [clicks, setClicks] = useState(0);
  const [money, setMoney] = useState(0);
  const gameTotals = useRef({ clicks: 0, money: 0 });
  const [leftMenu, setleftMenu] = useState(false);
  const [achievmentsMenu, setachievmentsMenu] = useState(false);
  const [itemsMenu, setitemsMenu] = useState(false);
  const [catsMenu, setcatsMenu] = useState(false);
  const [accountMenu, setaccountMenu] = useState(false);
  const [ownedCats, setOwnedCats] = useState({});
  const [ownedUpgrades, setOwnedUpgrades] = useState({});
  const [ownedItems, setOwnedItems] = useState({});
  const [ownedSelectCats, setOwnedSelectCats] = useState({});
  const [popups, setPopups] = useState([]);
  const popupId = useRef(0);
  const [activeBoosts, setActiveBoosts] = useState([]);
  const [claimed, setClaimed] = useState({});
  const [selectedCat, setSelectedCat] = useState({ image: cat });
  const [actionError, setActionError] = useState("");

  const { loaded, error, refresh } = useGameSync((data) => {
    setClicks(data.clicks);
    setMoney(data.money);
    gameTotals.current = { clicks: data.clicks, money: data.money };
    setOwnedCats(data.ownedCats);
    setOwnedUpgrades(data.ownedUpgrades);
    setOwnedItems(data.ownedItems);
    setOwnedSelectCats(data.ownedSelectCats);
    setClaimed(data.claimedAchievements);
    const skin = clickCats.find((candidate) =>
      data.selectedCatId.endsWith(candidate.imagePath || ""),
    );
    setSelectedCat(skin || clickCats[0]);
  });

  const { send: sendClickToServer, limited } = useClickSender({
    onResult: (result) => {
      const nextClicks = Number(result.clicks) || 0;
      const nextMoney = Number(result.totalMoney) || 0;
      const clicksEarned = Math.max(0, nextClicks - gameTotals.current.clicks);
      const moneyEarned = Math.max(0, nextMoney - gameTotals.current.money);
      gameTotals.current = { clicks: nextClicks, money: nextMoney };
      setClicks(nextClicks);
      setMoney(nextMoney);

      const popups = [
        { type: "click", text: `+${FormatNumber(clicksEarned)}` },
      ];
      if (result.didMoneyDrop) {
        popups.push({
          type: "money",
          text: `+${FormatNumber(moneyEarned)}`,
        });
      }
      if (result.didCritDrop) {
        popups.push({
          type: "crit",
          text: `+${FormatNumber(clicksEarned)}`,
        });
      }
      if (result.isAchievementUnlocked) {
        popups.push({ type: "golden", text: "Achievement unlocked!" });
      }
      if (result.itemReceivedName) {
        popups.push({
          type: "golden",
          text: `Received ${result.itemReceivedName}`,
        });
      }
      addPopups(popups);

      if (result.isAchievementUnlocked || result.itemReceivedName) {
        refresh().catch((err) => setActionError(err.message));
      }
    },
    onError: (err) => setActionError(err.message),
  });

  const { location: goldeCatLocation, catchCat: catchGoldenCat } = useGoldenCat(
    {
      enabled: loaded && !error,
      beforeClaim: refresh,
      onClaimed: ({ reward, amount, message }) => {
        setMoney(amount);
        addPopups([
          {
            type: "golden",
            text: message || `Golden Cat +${FormatNumber(reward)}`,
          },
        ]);
      },
      onError: (err) => addPopups([{ type: "golden", text: err.message }]),
    },
  );

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

  async function BuyCat(cat) {
    if (ownedCats[cat.id] || money < cat.cost) return;
    setActionError("");
    try {
      await buyCatRequest(token, user.userId, cat.apiType);
      await refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function BuyUpgrade(upgrade) {
    const level = ownedUpgrades[upgrade.catId] || 0;
    const upgradeCost = Math.ceil(1 + (level + 1) * 1.5);
    const cat = cats.find((candidate) => candidate.id === upgrade.catId);

    if (!ownedCats[upgrade.catId]) return;
    if (!cat || money < upgradeCost) return;

    setActionError("");
    try {
      await upgradeCatRequest(token, user.userId, cat.apiType);
      await refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function UseItem(item) {
    if (!ownedItems[item.id] || activeBoosts.length > 0) return;

    setActionError("");
    try {
      await activateItemRequest(token, user.userId, item.apiId);
      await refresh();

      const boostId = Date.now() + Math.random();
      setActiveBoosts((list) => [...list, { id: boostId }]);
      setTimeout(() => {
        setActiveBoosts((list) => list.filter((boost) => boost.id !== boostId));
      }, item.time * 1000);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function ChooseCat(cat) {
    if (!ownedSelectCats[cat.code]) return;

    setActionError("");
    try {
      await selectSkin(token, user.userId, cat.imagePath);
      setSelectedCat(cat);
      await refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  function Click() {
    sendClickToServer();
    setActionError("");
  }

  if (error)
    return <p className="techMessage">Something went wrong : {error}</p>;
  if (!loaded) return <p className="techMessage">Loading game...</p>;

  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      {limited && <p className="rateLimitWarning">Klikasz zbyt szybko!</p>}
      {actionError && <p className="rateLimitWarning">{actionError}</p>}
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
      <CatBtn onClick={Click} image={selectedCat.image} />
      <ClickPopups popups={popups} />
      <GoldenCat location={goldeCatLocation} onCatch={catchGoldenCat} />
      <ClickCat ownedCats={ownedCats} />
      <MultiCat ownedCats={ownedCats} />
      <MoneyMultiCat ownedCats={ownedCats} />
      <CritMultiCat ownedCats={ownedCats} />
      <CritChanceMultiCat ownedCats={ownedCats} />
      <MoneyDropChanceCat ownedCats={ownedCats} />
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
        clicks={clicks}
        claimed={claimed}
      />
      <ItemsMenu
        isOpen={itemsMenu}
        close={() => setitemsMenu(false)}
        ownedItems={ownedItems}
        use={UseItem}
      />
      <CatsMenu
        isOpen={catsMenu}
        close={() => setcatsMenu(false)}
        choose={ChooseCat}
        ownedSelectCats={ownedSelectCats}
      />
      <AccountMenu isOpen={accountMenu} close={() => setaccountMenu(false)} />
    </>
  );
}

export default Home;
