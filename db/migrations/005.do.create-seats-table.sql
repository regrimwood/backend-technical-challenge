CREATE TABLE allocated_seats (
    id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id),
);