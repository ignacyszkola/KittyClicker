import "./CatsMenu.css";
import closeIcon from "../assets/close.svg";
import { clickCats } from "../utils/ShopData";

function Cat({ name, image, choose }) {
  return (
    <div className="cat">
      <span>{name}</span><br />
      <img src={image} draggable="false"/>
      <hr />
      <button onClick={choose}>Choose</button>
    </div>
  );
}

function CatsMenu({ isOpen, close, choose, ownedSelectCats = {} }) {
  const availableCats = clickCats
    .filter((cat) => typeof ownedSelectCats[cat.code] === "string")
    .map((cat) => ({
      ...cat,
      imagePath: ownedSelectCats[cat.code],
    }));

  return (
    <div className={`catsMenu ${isOpen ? "open" : ""}`}>
      <h2>Cats</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} />
      </button>
      <div className="catList">
        {availableCats.length === 0 && <p>No cats unlocked yet.</p>}
        {availableCats.map((cat) => (
          <Cat
            key={cat.id}
            name={cat.name}
            image={cat.image}
            choose={() => choose(cat)}
          />
        ))}
      </div>
    </div>
  );
}

export default CatsMenu;
