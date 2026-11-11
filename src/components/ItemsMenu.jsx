import "./ItemsMenu.css";
import closeIcon from "../assets/close.svg";
import { items } from "../utils/ShopData";;

function Item({ name, image, use }) {
  return (
    <div className="item">
      <span>{name}</span>
      <img src={image} />
      <hr />
      <button onClick={use}>Użyj</button>
    </div>
  );
}

function ItemsMenu({ isOpen, close, ownedItems, use }) {
  return (
    <div className={`itemsMenu ${isOpen ? "open" : ""}`}>
      <h2>Itemy</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} />
      </button>
      <div className="itemList">
        {items
          .filter((item) => ownedItems[item.id])
          .map((item) => (
            <Item
              key={item.id}
              name={item.name}
              image={item.image}
              use={() => use(item)}
            />
          ))}
      </div>
    </div>
  );
}

export default ItemsMenu;
