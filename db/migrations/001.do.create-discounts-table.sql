CREATE TABLE discounts(
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    percentDiscount DECIMAL(5,2),
    fixedPrice DECIMAL(10,2),
);