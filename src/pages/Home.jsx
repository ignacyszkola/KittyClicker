import "./Home.css";
import menuIcon from "../assets/menu.svg";
import { useState } from "react";

function OpenLeftMenuButton() {
  return (
    <button className="menuButton">
      <img src={menuIcon} />
    </button>
  );
}

function Shop() {
    const [shopPage, setShopPage] = useState("cats");
    return (
        <div className="shop">
        <h2>Sklep</h2>
        <div className="shopHeaderButtons">
            <button id="shopCatButton" onClick={() => setShopPage("cats")}>Koty</button>
            <button id="shopUpgradeButton" onClick={() => setShopPage("upgrades")}>Ulepszenia</button>
        </div>
        <div className="shopContent">

        </div>
        </div>
    )
}

function Home() {
  return (
    <>
      <h1 className="homeTitle">KittyClicker</h1>
      <OpenLeftMenuButton />
      <Shop />
    </>
  );
}

export default Home;
