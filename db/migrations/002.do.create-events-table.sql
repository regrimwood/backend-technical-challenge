CREATE TABLE events(
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    imageUrl NVARCHAR(255) NOT NULL,
    bookingLimit INT NOT NULL,
    type NVARCHAR(50) NOT NULL CHECK (type IN ('allocated', 'generalAdmission'))
);