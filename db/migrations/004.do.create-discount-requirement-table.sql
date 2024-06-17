CREATE TABLE discount_requirements (
    id INT PRIMARY KEY IDENTITY(1,1),
    discount_id INT NOT NULL,
    price_id INT NOT NULL,
    min_quantity INT NOT NULL CHECK (min_quantity > 0),
    max_quantity INT CHECK (max_quantity > 0),
    FOREIGN KEY (discount_id) REFERENCES discounts(id),
    FOREIGN KEY (price_id) REFERENCES prices(id)
);