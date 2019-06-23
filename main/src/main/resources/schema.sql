DROP SCHEMA craft;
CREATE SCHEMA craft;
USE craft;

CREATE TABLE appointment (
    id INTEGER NOT NULL AUTO_INCREMENT,
    end DATETIME,
    start DATETIME,
    pet_id INTEGER,
    vet_id INTEGER,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE pet (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    owner_email_id VARCHAR(255),
    owner_first_name VARCHAR(255),
    owner_last_name VARCHAR(255),
    owner_phone_no BIGINT,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE vet (
    id INTEGER NOT NULL AUTO_INCREMENT,
    email_id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_no BIGINT,
    PRIMARY KEY (id)
) ENGINE=INNODB;

ALTER TABLE `appointment` ADD CONSTRAINT `FK_APPOINTMENT_PET_ID` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`id`);
ALTER TABLE `appointment` ADD CONSTRAINT `FK_APPOINTMENT_VET_ID` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`id`);