import "./Home.css";
import menuIcon from "../assets/menu.svg";

function OpenLeftMenuButton() {
  return (
    <button className="menuButton">
      <img src={menuIcon} />
    </button>
  );
}

function Home() {
  return (
    <>
      <h2 className="homeTitle">KittyClicker</h2>
      <OpenLeftMenuButton />
    </>
  );
}

export default Home;
