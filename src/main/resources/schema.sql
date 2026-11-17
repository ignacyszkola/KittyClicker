
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    money BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,
    selected_skin_id INTEGER,
    FOREIGN KEY (selected_skin_id)
        REFERENCES user_cat_skins(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cat_types (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cat_skins (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    image_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image_path TEXT NOT NULL,
    boost_multiplier INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    required_clicks BIGINT NOT NULL UNIQUE,
    reward_item_id INTEGER,
    reward_skin_id INTEGER,
    FOREIGN KEY (reward_item_id)
        REFERENCES items(id)
        ON DELETE SET NULL,
    FOREIGN KEY (reward_skin_id)
        REFERENCES cat_skins(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_cats (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    cat_type_id INTEGER NOT NULL,
    level BIGINT NOT NULL DEFAULT 1,
    point_multiplier_value BIGINT NOT NULL DEFAULT 1,
    money_drop_multiplier_value BIGINT NOT NULL DEFAULT 1,
    critical_click_multiplier_value BIGINT NOT NULL DEFAULT 1,
    critical_click_chance_percentage INTEGER NOT NULL DEFAULT 1,
    money_drop_chance_percentage INTEGER NOT NULL DEFAULT 1,
    cps REAL NOT NULL DEFAULT 1,
    UNIQUE (user_id, cat_type_id),
    FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE,
    FOREIGN KEY (cat_type_id)
        REFERENCES cat_types(id)
);

CREATE TABLE IF NOT EXISTS user_cat_skins (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    cat_skin_id INTEGER NOT NULL,
    UNIQUE (user_id, cat_skin_id),
    FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE,
    FOREIGN KEY (cat_skin_id)
        REFERENCES cat_skins(id)
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE (user_id, item_id),
    FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE,
    FOREIGN KEY (item_id)
        REFERENCES items(id)
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    UNIQUE (user_id, achievement_id),
    FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE,
    FOREIGN KEY (achievement_id)
        REFERENCES achievements(id)
);
