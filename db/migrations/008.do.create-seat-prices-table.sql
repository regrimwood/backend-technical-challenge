CREATE TABLE allocated_seats_prices (
    allocated_seat_id INT NOT NULL,
    price_id INT NOT NULL,
    PRIMARY KEY (allocated_seat_id, price_id),
    FOREIGN KEY (allocated_seat_id) REFERENCES allocated_seats(id),
    FOREIGN KEY (price_id) REFERENCES prices(id)
);