import "./ItemsMenu.css";
import closeIcon from "../assets/close.svg";
function ItemsMenu({ isOpen, close }) {
  return (
    <div className={`itemsMenu ${isOpen ? "open" : ""}`}>
      <h2>Itemy</h2>
      <button onClick={close}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}

export default ItemsMenu;
