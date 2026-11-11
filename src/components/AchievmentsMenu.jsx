import "./AchievmentsMenu.css";
import closeIcon from "../assets/close.svg";
import {
  singleCompleteAchievements,
  infiniteAchievement,
  reachedAchievementLvl,
} from "../utils/achievements";

function Achievement({ title, description, goal, clicks, claim }) {
  const done = clicks >= goal;
  const progress = Math.min(100, (clicks / goal) * 100);

  return (
    <div className={`achievement ${done ? "done" : ""}`}>
      <span className="achievTitle">{title}</span>
      <span className="achievDesc">{description}</span>
      <span className="achievProgress">{clicks} / {goal}</span>
      <div className="achievementBar">
        <div className="achievementBarFill" style={{ width: `${progress}%` }} />
      </div>
      <button className={`claimButton ${done ? "done" : ""}`} disabled={!done} onClick={claim}>Odbierz</button>
    </div>
  );
}

function AchievmentsMenu({ isOpen, close, clicks, claim }) {
  const reached = reachedAchievementLvl(clicks);
  const next = infiniteAchievement(reached + 1);

  const recent = Array.from({ length: reached }, (_, i) =>
    infiniteAchievement(reached - i),
  );

  return (
    <div className={`achievmentsMenu ${isOpen ? "open" : ""}`}>
      <h2>Osiągnięcia</h2>
      <button onClick={close} className="closeButton">
        <img src={closeIcon} />
      </button>
      <div className="achievementsList">
      {singleCompleteAchievements.map((a) => (
        <Achievement
          key={a.id}
          title={a.name}
          description={a.description}
          goal={a.goal}
          clicks={clicks}
          claim={claim}
        />
      ))}

      {[next, ...recent].map((a) => (
        <Achievement
          key={a.id}
          title={<>10<sup>{a.power}</sup></>}
          description={<>Zdobądź 10<sup>{a.power}</sup> kliknięć</>}
          goal={a.goal}
          clicks={clicks}
          claim={claim}
        />
      ))}
    </div>
    </div>
  );
}

export default AchievmentsMenu;
