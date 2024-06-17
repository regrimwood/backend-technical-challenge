CREATE TABLE discounts(
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    percent_discount DECIMAL(5,2),
    fixed_price DECIMAL(10,2),
);