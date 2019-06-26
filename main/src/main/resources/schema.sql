DROP SCHEMA craft;
CREATE SCHEMA craft;
USE craft;

CREATE TABLE appointment (
    id INTEGER NOT NULL AUTO_INCREMENT,
    time_zone VARCHAR(255) NOT NULL,
    end DATETIME NOT NULL,
    start DATETIME NOT NULL,
    pet_id INTEGER NOT NULL,
    vet_id INTEGER NOT NULL,
    completed BIT  NOT NULL DEFAULT 0,
    deleted BIT  NOT NULL DEFAULT 0,
    running BIT  NOT NULL DEFAULT 0,
    scheduled BIT  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE pet (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    owner_email_id VARCHAR(255) NOT NULL,
    owner_first_name VARCHAR(255) NOT NULL,
    owner_last_name VARCHAR(255) NOT NULL,
    owner_phone_no BIGINT NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE vet (
    id INTEGER NOT NULL AUTO_INCREMENT,
    email_id VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_no BIGINT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

ALTER TABLE `appointment` ADD CONSTRAINT `FK_APPOINTMENT_PET_ID` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`id`);
ALTER TABLE `appointment` ADD CONSTRAINT `FK_APPOINTMENT_VET_ID` FOREIGN KEY (`vet_id`) REFERENCES `vet` (`id`);