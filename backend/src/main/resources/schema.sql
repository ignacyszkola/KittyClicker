PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    money INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,

    selected_skin_id INTEGER,

    points_per_click_level INTEGER NOT NULL DEFAULT 0,
    points_per_click_boost INTEGER NOT NULL DEFAULT 1,
    points_per_click_available INTEGER NOT NULL DEFAULT 0,

    money_chance_level INTEGER NOT NULL DEFAULT 0,
    money_chance_boost INTEGER NOT NULL DEFAULT 1,
    money_chance_available INTEGER NOT NULL DEFAULT 0,

    crit_chance_level INTEGER NOT NULL DEFAULT 0,
    crit_chance_boost INTEGER NOT NULL DEFAULT 1,
    crit_chance_available INTEGER NOT NULL DEFAULT 0,

    money_multiplier_level INTEGER NOT NULL DEFAULT 0,
    money_multiplier_boost INTEGER NOT NULL DEFAULT 1,
    money_multiplier_available INTEGER NOT NULL DEFAULT 0,

    crit_multiplier_level INTEGER NOT NULL DEFAULT 0,
    crit_multiplier_boost INTEGER NOT NULL DEFAULT 1,
    crit_multiplier_available INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (selected_skin_id) REFERENCES cat_skins(id)
);

CREATE TABLE passive_cats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    level INTEGER NOT NULL DEFAULT 1,
    cps REAL NOT NULL DEFAULT 1.0,

    points_per_click_level INTEGER NOT NULL DEFAULT 0,
    points_per_click_boost INTEGER NOT NULL DEFAULT 1,
    points_per_click_available INTEGER NOT NULL DEFAULT 0,

    money_chance_level INTEGER NOT NULL DEFAULT 0,
    money_chance_boost INTEGER NOT NULL DEFAULT 1,
    money_chance_available INTEGER NOT NULL DEFAULT 0,

    crit_chance_level INTEGER NOT NULL DEFAULT 0,
    crit_chance_boost INTEGER NOT NULL DEFAULT 1,
    crit_chance_available INTEGER NOT NULL DEFAULT 0,

    money_multiplier_level INTEGER NOT NULL DEFAULT 0,
    money_multiplier_boost INTEGER NOT NULL DEFAULT 1,
    money_multiplier_available INTEGER NOT NULL DEFAULT 0,

    crit_multiplier_level INTEGER NOT NULL DEFAULT 0,
    crit_multiplier_boost INTEGER NOT NULL DEFAULT 1,
    crit_multiplier_available INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cat_skins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    image_path TEXT NOT NULL
);

CREATE TABLE user_cat_skins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skin_id INTEGER NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, skin_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skin_id) REFERENCES cat_skins(id)
);

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image_path TEXT,
    boost_multiplier INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL
);

CREATE TABLE inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    UNIQUE (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    required_clicks INTEGER NOT NULL UNIQUE,
    reward_item_id INTEGER,
    reward_skin_id INTEGER,

    FOREIGN KEY (reward_item_id) REFERENCES items(id),
    FOREIGN KEY (reward_skin_id) REFERENCES cat_skins(id)
);

CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);