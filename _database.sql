CREATE USER 'user'@'localhost' IDENTIFIED BY 'pass';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

CREATE DATABASE sensor_v1;

use sensor_v1;

CREATE TABLE readings (
    PRIMARY KEY (reading_id),
    reading_id INTEGER NOT NULL AUTO_INCREMENT,
    temp NUMERIC(5, 2) NOT NULL,
    hum NUMERIC(5, 2) NOT NULL,
    time_ms BIGINT NOT NULL -- Time in miliseconds because Date().getTime() returns elapsed miliseconds from 1970
);