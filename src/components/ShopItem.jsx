import { FormatNumber } from "../utils/FormatNumber";
import "./ShopItem.css";
import catFoodIcon from "../assets/cat-food.png";

function ShopItem({ name, cost, canAfford, buy }) {
  return (
    <button className="shopItem" onClick={buy} disabled={!canAfford}>
      <span className="shopItemName">{name}</span><br />
      <span className="shopItemCost"><img src={catFoodIcon} />{FormatNumber(cost)}</span>
    </button>
  );
}

export default ShopItem;
