INSERT OR IGNORE INTO cat_types (code, name) VALUES
('POINT_MULTIPLIER', 'Point Multiplier Cat'),
('MONEY_DROP_MULTIPLIER', 'Money Drop Multiplier Cat'),
('CRITICAL_CLICK_MULTIPLIER', 'Critical Click Multiplier Cat'),
('CRITICAL_CLICK_CHANCE', 'Critical Click Chance Cat'),
('MONEY_DROP_CHANCE', 'Money Drop Chance Cat'),
('PASSIVE_CLICKER', 'Passive Clicker Cat');

INSERT OR IGNORE INTO cat_skins (code, image_path) VALUES
('DEFAULT_1', 'skins/cat-1.png'),
('DEFAULT_2', 'skins/cat-2.png'),
('DEFAULT_3', 'skins/cat-3.png');

INSERT OR IGNORE INTO items
(code, name, boost_multiplier, duration_seconds)
VALUES
('CAT_BOOST', 'Cat Boost', 2, 10),
('KREMOWKA', 'Kremówka', 21, 37);

INSERT OR IGNORE INTO achievements
(code, name, required_clicks, reward_item_id, reward_skin_id)
VALUES (
    'KREMOWKA_2137',
    'Kremówka',
    2137,
    (SELECT id FROM items WHERE code = 'KREMOWKA'),
    (SELECT id FROM cat_skins WHERE code = 'DEFAULT_3')
);

WITH RECURSIVE powers(clicks) AS (
    SELECT 10
    UNION ALL
    SELECT clicks * 10
    FROM powers
    WHERE clicks < 100000000000000000
)
INSERT OR IGNORE INTO achievements
(code, name, required_clicks, reward_item_id)
SELECT
    'CLICKS_' || clicks,
    clicks || ' Clicks',
    clicks,
    (SELECT id FROM items WHERE code = 'CAT_BOOST')
FROM powers;