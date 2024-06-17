SET IDENTITY_INSERT events ON;

INSERT INTO events (id, name, imageUrl, type, bookingLimit)
VALUES 
(1, 'Ghost of Michael Jackson: On Tour 2021', 'https://upload.wikimedia.org/wikipedia/en/c/c8/Ghosts_MJ.jpg', 'allocated', 15),
(2, 'Elon Musk''s Fun Doge Party', 'https://i.redd.it/g4tnkm3pzvv61.jpg', 'generalAdmission', 15);

SET IDENTITY_INSERT events OFF;

SET IDENTITY_INSERT prices ON;

INSERT INTO prices (id, eventId, price, type)
VALUES 
(1, 1, 25, 'Adult'),
(2, 1, 15, 'Child');

SET IDENTITY_INSERT prices OFF;

SET IDENTITY_INSERT allocated_seats ON;

INSERT INTO allocated_seats (id, event_id)
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1);

SET IDENTITY_INSERT allocated_seats OFF;

INSERT INTO allocated_seats_prices (allocated_seat_id, price_id)
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2);

SET IDENTITY_INSERT ga_areas ON;

INSERT INTO ga_areas (id, event_id)
VALUES
(1, 1);

SET IDENTITY_INSERT ga_areas OFF;

INSERT INTO ga_areas_prices (ga_area_id, price_id)
VALUES
(1, 1),
(1, 2);

SET IDENTITY_INSERT discounts ON;

INSERT INTO discounts (id, name, percentDiscount)
VALUES
(1, 'Group Discount', 10);

INSERT INTO discounts (id, name, fixedPrice)
VALUES
(2, 'Family Discount', 70);

SET IDENTITY_INSERT discounts OFF;

SET IDENTITY_INSERT discount_items ON;

INSERT INTO discount_items (id, discount_id, price_id, min_quantity, max_quantity)
VALUES
(1, 1, 1, 4, null),
(2, 2, 1, 2, 2),
(3, 2, 2, 2, 3);

SET IDENTITY_INSERT discount_items OFF;