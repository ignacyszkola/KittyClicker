import "./CatsMenu.css";
import closeIcon from "../assets/close.svg";
function CatsMenu({ isOpen, close }) {
  return (
    <div className={`catsMenu ${isOpen ? "open" : ""}`}>
      <h2>Koty</h2>
      <button onClick={close}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}

export default CatsMenu;
