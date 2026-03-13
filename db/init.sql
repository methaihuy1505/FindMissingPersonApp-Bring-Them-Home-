USE railway;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS sightings;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS missing_persons;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE missing_persons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    gender ENUM('male','female','other'),
    birth_date DATE,
    last_seen_date DATE,
    last_seen_location VARCHAR(255),
    description TEXT,
    status ENUM('missing','found') DEFAULT 'missing',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    missing_person_id BIGINT,
    report_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (missing_person_id) REFERENCES missing_persons(id)
        ON DELETE CASCADE
);

CREATE TABLE sightings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    missing_person_id BIGINT,
    reported_by BIGINT,
    location VARCHAR(255),
    description TEXT,
    sighting_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (missing_person_id) REFERENCES missing_persons(id)
        ON DELETE CASCADE,

    FOREIGN KEY (reported_by) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    missing_person_id BIGINT,
    image_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (missing_person_id) REFERENCES missing_persons(id)
        ON DELETE CASCADE
);
INSERT INTO users (name,email,phone) VALUES
('Nguyen Van A','a@gmail.com','0900000001'),
('Tran Thi B','b@gmail.com','0900000002'),
('Le Van C','c@gmail.com','0900000003');
INSERT INTO missing_persons
(full_name,gender,last_seen_date,last_seen_location,description,created_by)
VALUES
('Nguyen Van D','male','2025-10-10','Ho Chi Minh City','Last seen wearing blue shirt',1),
('Tran Thi E','female','2025-09-15','Ha Noi','Missing near bus station',2);
INSERT INTO sightings
(missing_person_id,reported_by,location,description,sighting_date)
VALUES
(1,2,'District 1','Looks similar to missing person','2025-10-12');