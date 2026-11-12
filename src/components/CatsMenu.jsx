import "./CatsMenu.css";
import closeIcon from "../assets/close.svg";
import { clickCats } from "../utils/ShopData";

function Cat({ name, image, choose }) {
  return (
    <div className="cat">
      <span>{name}</span><br />
      <img src={image} />
      <hr />
      <button onClick={choose}>Wybierz</button>
    </div>
  );
}

function CatsMenu({ isOpen, close, choose }) {
  return (
    <div className={`catsMenu ${isOpen ? "open" : ""}`}>
      <h2>Koty</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} />
      </button>
      <div className="catList">
        {clickCats.map((cat) => (
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
