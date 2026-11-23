import goldenCat from "../assets/goldenCat.webp";
import "./GoldenCat.css";

function GoldenCat({ location, onCatch}) {
  if (!location) return null;

  return (
    <button
      className="goldenCat"
      style={{ left: `${location.x}%`, top: `${location.y}%`, "--life": `${location.lifetime}ms` }}
      onClick={onCatch}>
      <img src={goldenCat} draggable="false" />
      <span className="goldenCatTimer" />
    </button>
  );
}

export default GoldenCat;
