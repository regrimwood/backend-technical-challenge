CREATE TABLE ga_areas_prices (
    ga_area_id INT NOT NULL,
    price_id INT NOT NULL,
    PRIMARY KEY (ga_area_id, price_id),
    FOREIGN KEY (ga_area_id) REFERENCES ga_areas(id),
    FOREIGN KEY (price_id) REFERENCES prices(id)
);