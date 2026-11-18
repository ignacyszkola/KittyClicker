import { FormatNumber } from "../utils/FormatNumber";
import "./ShopItem.css";
import catFoodIcon from "../assets/cat-food.png";

function ShopItem({ name, cost, canAfford, buy }) {
  return (
    <button className="shopItem" onClick={buy} disabled={!canAfford}>
      <span className="name">{name}</span><br />
      <span className="cost"><img src={catFoodIcon} draggable="false"/>{FormatNumber(cost)}</span>
    </button>
  );
}

export default ShopItem;
