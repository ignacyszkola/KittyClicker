import "./AchievmentsMenu.css";
import closeIcon from "../assets/close.svg";
function AchievmentsMenu({ isOpen, close }) {
  return (
    <div className={`achievmentsMenu ${isOpen ? "open" : ""}`}>
      <h2>Osiągnięcia</h2>
      <button onClick={close}>
        <img src={closeIcon} />
      </button>
    </div>
  );
}

export default AchievmentsMenu;
