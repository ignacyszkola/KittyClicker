INSERT OR IGNORE INTO cat_types (code, name) VALUES
('POINT_MULTIPLIER', 'Kot mnożący punkty'),
('MONEY_DROP_MULTIPLIER', 'Kot mnożący drop waluty'),
('CRITICAL_CLICK_MULTIPLIER', 'Kot mnożący krytyczne klik'),
('CRITICAL_CLICK_CHANCE', 'Kot mnożący szansę krytyczne klik'),
('MONEY_DROP_CHANCE', 'Kot mnożący szansę na drop waluty'),
('PASSIVE_CLICKER', 'Klikający kot');

INSERT OR IGNORE INTO cat_skins (code, name, image_path) VALUES
('JOHN_CAT', 'John Cat', 'assets/cat.png'),
('FLOPPA_CAT', 'Floppa Cat', 'assets/flop.webp'),
('POPE_CAT', 'Pope Cat', 'assets/pope.webp');

INSERT OR IGNORE INTO cat_skins (code, name, image_path) VALUES
('UNLOCK_2137', '2137 Unlock Skin', 'assets/unlock-2137.png');

INSERT OR IGNORE INTO items
(code, name, image_path, boost_multiplier, duration_seconds)
VALUES
('CAT_BOOST', 'Boost', 'assets/2x.png', 2, 10),
('KREMOWKA', 'Kremówka', 'assets/kremowka.png', 21, 37);

INSERT OR IGNORE INTO achievements
(code, name, required_clicks, reward_item_id, reward_skin_id)
VALUES (
    'KREMOWKA_2137',
    'Kremówka',
    2137,
    (SELECT id FROM items WHERE code = 'KREMOWKA'),
    (SELECT id FROM cat_skins WHERE code = 'UNLOCK_2137')
);

WITH RECURSIVE powers(clicks) AS (
    SELECT 10
    UNION ALL
    SELECT clicks * 10
    FROM powers
    WHERE clicks < 1000000000000000000
)
INSERT OR IGNORE INTO achievements
(code, name, required_clicks, reward_item_id)
SELECT
    'CLICKS_' || clicks,
    clicks || ' Clicks',
    clicks,
    (SELECT id FROM items WHERE code = 'CAT_BOOST')
FROM powers;